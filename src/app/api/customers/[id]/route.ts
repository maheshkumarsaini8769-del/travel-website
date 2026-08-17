import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { customersCollection, bookingsCollection, leadsCollection } from '@/lib/db'
import { asString, asOptionalString, asPhone } from '@/lib/util'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('customers.view')
  if (denied) return denied
  try {
    const col = await customersCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

    const [bookings, leads] = await Promise.all([
      bookingsCollection().then((c) => c.find({ 'customer.phone': doc.phone }).sort({ createdAt: -1 }).limit(20).toArray()),
      leadsCollection().then((c) => c.find({ phone: doc.phone }).sort({ createdAt: -1 }).limit(20).toArray()),
    ])
    const spent = bookings.reduce((s, b) => s + b.paidAmount, 0)
    const pending = bookings.reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount), 0)

    return Response.json({
      customer: {
        id: doc._id,
        name: doc.name,
        phone: doc.phone,
        email: doc.email,
        notes: doc.notes,
        source: doc.source,
        lastContactedAt: doc.lastContactedAt,
        createdAt: doc.createdAt,
        bookingCount: bookings.length,
        totalSpent: spent,
        pendingPayment: pending,
      },
      bookings,
      leads,
    })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('customers.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const col = await customersCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

    const set: Record<string, unknown> = { updatedAt: Date.now() }
    if (body?.name !== undefined) set.name = asString(body.name, 120)
    if (body?.email !== undefined) set.email = asOptionalString(body.email, 200)
    if (body?.notes !== undefined) set.notes = asOptionalString(body.notes, 2000)
    if (body?.source !== undefined) set.source = asOptionalString(body.source, 100)
    if (body?.lastContactedAt !== undefined) set.lastContactedAt = Number(body.lastContactedAt) || Date.now()

    await col.updateOne({ _id: ctx.params.id }, { $set: set })
    if (actor) void audit(actor.username, 'customer.updated', 'customers', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('customers.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await customersCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'customer.deleted', 'customers', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}