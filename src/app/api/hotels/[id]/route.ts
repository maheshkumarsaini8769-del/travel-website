import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { hotelsCollection } from '@/lib/db'
import { sanitizeHotel } from '@/lib/sanitize'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('hotels.view')
  if (denied) return denied
  try {
    const doc = await hotelsCollection().then((c) => c.findOne({ _id: ctx.params.id }))
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('hotels.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const col = await hotelsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    const hotel = sanitizeHotel({ ...existing, ...body })
    await col.updateOne({ _id: ctx.params.id }, { $set: { ...hotel, updatedAt: Date.now() } })
    if (actor) void audit(actor.username, 'hotel.updated', 'hotels', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('hotels.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await hotelsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'hotel.deleted', 'hotels', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}