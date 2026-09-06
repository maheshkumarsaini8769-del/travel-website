import { NextRequest } from 'next/server'
import { hashPassword, verifyPassword, setAdminSessionCookie, audit, findAdminByEmail, createAdminFromEmail, ENV_ADMIN_ID } from '@/lib/auth'
import { adminsCollection, ensureIndexesOnce } from '@/lib/db'

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
    const password = String(body?.password ?? '')
    const isOauth = body?.oauth === true
    const oauthName = body?.name ? String(body.name) : undefined

    // OAuth login: find or create admin by email
    if (isOauth && email) {
      const ALLOWED_EMAIL = 'maheshkumarsaini8769@gmail.com'

      let admin = await findAdminByEmail(email)

      // Auto-create if not exists
      if (!admin) {
        const newId = await createAdminFromEmail(email, oauthName)
        if (newId) {
          admin = { _id: newId, email, passwordHash: '', salt: '', name: oauthName ?? email.split('@')[0], role: 'superadmin', permissions: ['*'], active: true, createdAt: Date.now() }
        }
      }

      // DB fallback: if email is the allowed admin, use env-based admin
      if (!admin && email === ALLOWED_EMAIL) {
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
            const col = await adminsCollection()
            await col.updateOne({ _id: admin!._id }, { $set: { active: true } })
            admin.active = true
          } catch {
            admin.active = true
          }
        }

        if (admin.active) {
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
    }

    // Password login: email + password
    if (email && password) {
      try {
        const col = await adminsCollection()
        const admin = await col.findOne({ email })
        if (admin && admin.active && verifyPassword(password, admin.salt, admin.passwordHash)) {
          await col.updateOne({ _id: admin._id }, { $set: { lastLoginAt: Date.now() } })
          setAdminSessionCookie(admin._id)
          void audit(email, 'login', 'auth')
          return Response.json({
            ok: true,
            user: { email: admin.email, name: admin.name, role: admin.role, permissions: admin.permissions },
          })
        }
      } catch {
        // DB unavailable — fall through
      }

      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    return Response.json({ error: 'Email is required' }, { status: 400 })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
