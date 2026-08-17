import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { leadsCollection, bookingsCollection } from '@/lib/db'
import { asString, asOptionalString, asNumber, asPhone } from '@/lib/util'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/db'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('leads.view')
  if (denied) return denied
  try {
    const col = await leadsCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('leads.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()

  try {
    const body = await req.json()
    const col = await leadsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    const set: Record<string, unknown> = { updatedAt: Date.now() }
    const fields = ['name', 'phone', 'email', 'requirement', 'destination', 'travelDate', 'source', 'notes'] as const
    for (const f of fields) {
      if (body?.[f] !== undefined) set[f] = f === 'phone' ? asPhone(body[f]) : asOptionalString(body[f], 2000)
    }
    if (body?.travellers !== undefined) set.travellers = Math.max(1, Math.round(asNumber(body.travellers, 1)))
    if (body?.budget !== undefined) set.budget = asNumber(body.budget) > 0 ? Math.round(asNumber(body.budget)) : undefined
    if (body?.followUpDate !== undefined) set.followUpDate = asNumber(body.followUpDate) > 0 ? Math.round(asNumber(body.followUpDate)) : undefined
    if (body?.assignedTo !== undefined) set.assignedTo = asOptionalString(body.assignedTo, 100)
    if (body?.status !== undefined) {
      const status = asString(body.status, 20) as LeadStatus
      if (!LEAD_STATUSES.includes(status)) return Response.json({ error: 'Invalid status' }, { status: 400 })
      set.status = status

      // Converted leads can be linked to an existing booking
      if (status === 'converted') {
        const bookingId = asOptionalString(body.bookingId, 60)
        if (bookingId) {
          const booking = await bookingsCollection().then((c) => c.findOne({ bookingId }))
          if (booking) {
            set.bookingId = booking.bookingId
            if (booking.customer.phone === existing.phone) {
              await bookingsCollection().then((c) => c.updateOne({ bookingId }, { $set: { status: 'confirmed' } }))
            }
          }
        }
      }
    }

    await col.updateOne({ _id: ctx.params.id }, { $set: set })
    if (actor) void audit(actor.username, 'lead.updated', 'leads', ctx.params.id, { status: set.status })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('leads.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await leadsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'lead.deleted', 'leads', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
