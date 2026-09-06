import { NextRequest } from 'next/server'
import { setAdminSessionCookie, audit, findAdminByEmail, createAdminFromEmail, ENV_ADMIN_ID } from '@/lib/auth'

const RATE_WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 8
const attempts = new Map<string, { count: number; windowStart: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    attempts.set(ip, { count: 1, windowStart: now })
    return false
  }
  entry.count += 1
  if (entry.count > MAX_ATTEMPTS) return true
  return false
}

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const email = String(body?.email ?? '').trim().toLowerCase()
    const isOauth = body?.oauth === true
    const oauthName = body?.name ? String(body.name) : undefined

    if (!isOauth || !email) {
      return Response.json({ error: 'OAuth login required' }, { status: 400 })
    }

    let admin = await findAdminByEmail(email)

    if (!admin) {
      const newId = await createAdminFromEmail(email, oauthName)
      if (newId) {
        admin = { _id: newId, email, passwordHash: '', salt: '', name: oauthName ?? email.split('@')[0], role: 'superadmin', permissions: ['*'], active: true, createdAt: Date.now() }
      }
    }

    if (!admin) {
      setAdminSessionCookie(ENV_ADMIN_ID)
      void audit(email, 'oauth-login-env-fallback', 'auth')
      return Response.json({
        ok: true,
        user: { email, name: oauthName ?? 'Admin', role: 'superadmin', permissions: ['*'] },
      })
    }

    if (admin) {
      if (!admin.active) {
        try {
          const { adminsCollection } = await import('@/lib/db')
          const col = await adminsCollection()
          await col.updateOne({ _id: admin!._id }, { $set: { active: true } })
          admin.active = true
        } catch {
          admin.active = true
        }
      }

      if (admin.active) {
        const { adminsCollection } = await import('@/lib/db')
        await adminsCollection()
          .then((c) => c.updateOne({ _id: admin!._id }, { $set: { lastLoginAt: Date.now() } }))
          .catch(() => {})
        setAdminSessionCookie(admin._id)
        void audit(email, 'oauth-login', 'auth')
        return Response.json({
          ok: true,
          user: { email: admin.email, name: admin.name, role: admin.role, permissions: admin.permissions },
        })
      }
    }

    return Response.json({ error: 'Account is disabled' }, { status: 403 })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
