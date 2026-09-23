import { NextRequest, NextResponse } from 'next/server'
import ZenuxOAuth from 'zenuxs-oauth'
import {
  setAdminSessionCookie,
  getAdminCookieOptions,
  createAdminToken,
  createAdminFromEmail,
  audit,
  findAdminByEmail,
  ENV_ADMIN_ID,
  ADMIN_COOKIE,
} from '@/lib/auth'

const RATE_WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 30
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

const oauth = new ZenuxOAuth({
  clientId: process.env.NEXT_PUBLIC_ZENUX_CLIENT_ID || '1fe396337ca4c424',
})

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const accessToken = body?.accessToken || body?.access_token || body?.tokens?.access_token
    const idToken = body?.idToken || body?.id_token || body?.tokens?.id_token
    let email = String(body?.email ?? '').trim().toLowerCase()
    let name = body?.name ? String(body.name).trim() : ''
    const isOauth = body?.oauth === true || Boolean(accessToken || idToken)

    // Validate and enrich user profile using zenuxs-oauth inbuilt functions
    if (accessToken) {
      try {
        ;(oauth as any).setTokens({ access_token: accessToken })
        const userInfo = await oauth.getUserInfo()
        if (userInfo?.email) {
          email = String(userInfo.email).trim().toLowerCase()
        }
        if (userInfo?.name || userInfo?.nickname) {
          name = String(userInfo.name || userInfo.nickname).trim()
        }
      } catch {
        // If userinfo endpoint is temporarily unavailable, fall back to inbuilt decodeJWT
        if (idToken) {
          try {
            const payload = oauth.decodeJWT(idToken)
            if (payload?.email) {
              email = String(payload.email).trim().toLowerCase()
            }
            if (payload?.name || payload?.nickname) {
              name = String(payload.name || payload.nickname).trim()
            }
          } catch {}
        }
      }
    } else if (idToken) {
      try {
        const payload = oauth.decodeJWT(idToken)
        if (payload?.email) {
          email = String(payload.email).trim().toLowerCase()
        }
        if (payload?.name || payload?.nickname) {
          name = String(payload.name || payload.nickname).trim()
        }
      } catch {}
    }

    if (!isOauth || !email) {
      return NextResponse.json({ error: 'Valid OAuth authentication required' }, { status: 400 })
    }

    // Check if admin already exists in DB
    const admin = await findAdminByEmail(email)
    let adminId: string
    let adminRole = 'superadmin'
    let adminPermissions = ['*']

    if (admin) {
      if (!admin.active) {
        return NextResponse.json({ error: 'Account is disabled. Contact admin.' }, { status: 403 })
      }

      adminId = admin._id
      adminRole = admin.role
      adminPermissions = admin.permissions
      if (!name && admin.name) {
        name = admin.name
      }

      const { adminsCollection } = await import('@/lib/db')
      await adminsCollection()
        .then((c) => c.updateOne({ _id: admin._id }, { $set: { lastLoginAt: Date.now() } }))
        .catch(() => {})
    } else {
      // Auto-provision verified OAuth user as superadmin
      const createdId = await createAdminFromEmail(email, name || email.split('@')[0])
      if (createdId) {
        adminId = createdId
      } else {
        // Fallback to environment admin ID if DB is unreachable
        adminId = ENV_ADMIN_ID
      }
    }

    const authHeader = req.headers.get('authorization')
    const headerToken = authHeader && authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : ''
    const effectiveAccessToken = accessToken || headerToken

    const adminMeta = {
      email,
      name: name || email.split('@')[0],
      role: adminRole as any,
      permissions: adminPermissions,
    }

    const token = createAdminToken(adminId, adminMeta)
    setAdminSessionCookie(adminId, adminMeta)
    void audit(email, 'oauth-login', 'auth')

    const cookieOptions = getAdminCookieOptions()
    const res = NextResponse.json({
      ok: true,
      user: {
        email,
        name: name || email.split('@')[0],
        role: adminRole,
        permissions: adminPermissions,
      },
    })
    res.cookies.set(ADMIN_COOKIE, token, cookieOptions)
    if (effectiveAccessToken) {
      res.cookies.set('zenux_access_token', effectiveAccessToken, cookieOptions)
    }
    if (idToken) {
      res.cookies.set('zenux_id_token', idToken, cookieOptions)
    }
    return res
  } catch (err: any) {
    console.error('oauth login route error:', err)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
