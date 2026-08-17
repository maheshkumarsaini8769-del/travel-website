import { NextRequest } from 'next/server'
import { hashPassword, verifyPassword, setAdminSessionCookie, audit, ENV_ADMIN_ID } from '@/lib/auth'
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

// Creates the first super admin from env (ADMIN_PASSWORD) when no admin exists yet.
async function ensureDefaultAdmin(): Promise<void> {
  try {
    ensureIndexesOnce()
    const col = await adminsCollection()
    const count = await col.countDocuments()
    if (count === 0) {
      const password = process.env.ADMIN_PASSWORD ?? 'sunsky@2026'
      const { salt, hash } = hashPassword(password)
      await col.insertOne({
        _id: crypto.randomUUID(),
        username: 'admin',
        passwordHash: hash,
        salt,
        name: 'Super Admin',
        role: 'superadmin',
        permissions: ['*'],
        active: true,
        createdAt: Date.now(),
      })
    }
  } catch {
    // DB unavailable — env fallback below handles it
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const username = String(body?.username ?? 'admin').trim().toLowerCase() || 'admin'
    const password = String(body?.password ?? '')

    await ensureDefaultAdmin()
    try {
      const col = await adminsCollection()
      const admin = await col.findOne({ username })
      if (admin && admin.active && verifyPassword(password, admin.salt, admin.passwordHash)) {
        await col.updateOne({ _id: admin._id }, { $set: { lastLoginAt: Date.now() } })
        setAdminSessionCookie(admin._id)
        void audit(admin.username, 'login', 'auth')
        return Response.json({
          ok: true,
          user: { username: admin.username, name: admin.name, role: admin.role, permissions: admin.permissions },
        })
      }
    } catch {
      // DB unavailable — fall through to env fallback
    }

    // Env fallback keeps the panel usable while the database is unreachable
    const expected = process.env.ADMIN_PASSWORD ?? ''
    if (expected && username === 'admin' && password === expected) {
      setAdminSessionCookie(ENV_ADMIN_ID)
      return Response.json({
        ok: true,
        user: { username: 'admin', name: 'Admin', role: 'superadmin', permissions: ['*'] },
      })
    }

    return Response.json({ error: 'Invalid username or password' }, { status: 401 })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
