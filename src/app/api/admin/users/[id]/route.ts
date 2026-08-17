import { NextRequest } from 'next/server'
import { requireAdmin, hasPermission, getCurrentAdmin, hashPassword, audit } from '@/lib/auth'
import { adminsCollection, type AdminRole } from '@/lib/db'

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied
  const actor = await getCurrentAdmin()
  if (!actor || !hasPermission(actor, 'admin.users.edit')) return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const col = await adminsCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

    const set: Record<string, unknown> = {}
    if (body?.name !== undefined) set.name = String(body.name).trim()
    if (body?.active !== undefined) set.active = Boolean(body.active)
    if (body?.role !== undefined) {
      const role = String(body.role) as AdminRole
      if (!['superadmin', 'manager', 'booking-staff', 'content-manager'].includes(role)) {
        return Response.json({ error: 'Invalid role' }, { status: 400 })
      }
      set.role = role
    }
    if (body?.permissions !== undefined) {
      set.permissions = Array.isArray(body.permissions) ? body.permissions.map(String) : []
    }
    if (body?.password !== undefined) {
      const password = String(body.password)
      if (password.length < 8) return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      const { salt, hash } = hashPassword(password)
      set.salt = salt
      set.passwordHash = hash
    }

    const updates = Object.keys(set)
    if (updates.length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })
    await col.updateOne({ _id: ctx.params.id }, { $set: set })
    if (actor) void audit(actor.username, 'user.updated', 'admin-users', ctx.params.id, { fields: updates })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied
  const actor = await getCurrentAdmin()
  if (!actor || !hasPermission(actor, 'admin.users.delete')) return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const col = await adminsCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    if (actor.id === ctx.params.id) return Response.json({ error: 'You cannot delete your own account' }, { status: 400 })

    const superAdmins = await col.countDocuments({ role: 'superadmin', active: true })
    if (doc.role === 'superadmin' && superAdmins <= 1) {
      return Response.json({ error: 'Cannot delete the last active super admin' }, { status: 400 })
    }

    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'user.deleted', 'admin-users', ctx.params.id, { username: doc.username })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
