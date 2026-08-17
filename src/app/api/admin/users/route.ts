import { NextRequest } from 'next/server'
import { requireAdmin, hasPermission, getCurrentAdmin, hashPassword, audit } from '@/lib/auth'
import { adminsCollection, type AdminRole } from '@/lib/db'

export async function GET() {
  const denied = await requireAdmin('admin.users.view')
  if (denied) return denied
  try {
    const col = await adminsCollection()
    const docs = await col.find().sort({ createdAt: 1 }).toArray()
    const users = docs.map((d) => ({
      id: d._id,
      username: d.username,
      name: d.name,
      role: d.role,
      permissions: d.permissions,
      active: d.active,
      lastLoginAt: d.lastLoginAt ?? null,
      createdAt: d.createdAt,
    }))
    return Response.json(users)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('admin.users.create')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const username = String(body?.username ?? '').trim().toLowerCase()
    const password = String(body?.password ?? '')
    const name = String(body?.name ?? '').trim() || username
    const role = (String(body?.role ?? 'manager') as AdminRole)
    const permissions = Array.isArray(body?.permissions) ? body.permissions.map(String) : []
    const active = body?.active !== false

    if (!username || !/^[a-z0-9._-]{3,32}$/.test(username)) {
      return Response.json({ error: 'Username must be 3-32 chars (letters, numbers, dot, dash, underscore)' }, { status: 400 })
    }
    if (password.length < 8) return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    if (!['superadmin', 'manager', 'booking-staff', 'content-manager'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 })
    }

    const col = await adminsCollection()
    const existing = await col.findOne({ username })
    if (existing) return Response.json({ error: 'Username already exists' }, { status: 409 })

    const { salt, hash } = hashPassword(password)
    const id = crypto.randomUUID()
    await col.insertOne({
      _id: id,
      username,
      passwordHash: hash,
      salt,
      name,
      role,
      permissions,
      active,
      createdAt: Date.now(),
    })
    if (actor) void audit(actor.username, 'user.created', 'admin-users', id, { username, role })
    return Response.json({ ok: true, id }, { status: 201 })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
