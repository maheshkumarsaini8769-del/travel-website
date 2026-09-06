import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, hashPassword, audit } from '@/lib/auth'
import { adminsCollection, type AdminRole } from '@/lib/db'

export async function GET() {
  const denied = await requireAdmin('admin.users.view')
  if (denied) return denied
  try {
    const col = await adminsCollection()
    const docs = await col.find().sort({ createdAt: 1 }).toArray()
    const users = docs.map((d) => ({
      id: d._id,
      email: d.email,
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
    const email = String(body?.email ?? '').trim().toLowerCase()
    const name = String(body?.name ?? '').trim() || email.split('@')[0]
    const role = (String(body?.role ?? 'manager') as AdminRole)
    const active = body?.active !== false

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!['superadmin', 'manager', 'booking-staff', 'content-manager'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 })
    }

    const col = await adminsCollection()
    const existing = await col.findOne({ email })
    if (existing) return Response.json({ error: 'Email already exists' }, { status: 409 })

    const { salt, hash } = hashPassword(crypto.randomUUID().slice(0, 12))
    const id = crypto.randomUUID()
    await col.insertOne({
      _id: id,
      email,
      passwordHash: hash,
      salt,
      name,
      role,
      permissions: [],
      active,
      createdAt: Date.now(),
    })
    if (actor) void audit(actor.email, 'user.created', 'admin-users', id, { email, role })
    return Response.json({ ok: true, id }, { status: 201 })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin('admin.users.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return Response.json({ error: 'email required' }, { status: 400 })

  try {
    const col = await adminsCollection()
    const doc = await col.findOne({ email: email.toLowerCase() })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

    const superadmins = await col.countDocuments({ role: 'superadmin', active: true })
    if (doc.role === 'superadmin' && superadmins <= 1) {
      return Response.json({ error: 'Cannot remove the last superadmin' }, { status: 400 })
    }

    await col.deleteOne({ _id: doc._id })
    if (actor) void audit(actor.email, 'user.deleted', 'admin-users', doc._id, { email })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
