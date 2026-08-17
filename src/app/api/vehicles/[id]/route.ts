import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { vehiclesCollection } from '@/lib/db'
import { sanitizeVehicle } from '@/lib/sanitize'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('vehicles.view')
  if (denied) return denied
  try {
    const doc = await vehiclesCollection().then((c) => c.findOne({ _id: ctx.params.id }))
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('vehicles.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const col = await vehiclesCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    const vehicle = sanitizeVehicle({ ...existing, ...body })
    await col.updateOne({ _id: ctx.params.id }, { $set: { ...vehicle, updatedAt: Date.now() } })
    if (actor) void audit(actor.username, 'vehicle.updated', 'vehicles', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('vehicles.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await vehiclesCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'vehicle.deleted', 'vehicles', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}