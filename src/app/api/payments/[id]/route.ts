import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { paymentsCollection, bookingsCollection } from '@/lib/db'
import { asString, asOptionalString, asNumber } from '@/lib/util'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('payments.view')
  if (denied) return denied
  try {
    const col = await paymentsCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('payments.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const col = await paymentsCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

    const set: Record<string, unknown> = {}
    if (body?.amount !== undefined) {
      const old = doc.amount
      const amount = Math.max(1, asNumber(body.amount))
      set.amount = amount
      const delta = amount - old
      await bookingsCollection().then((c) =>
        c.updateOne({ bookingId: doc.bookingId }, [
          {
            $set: {
              paidAmount: { $max: [0, { $add: ['$paidAmount', delta] }] },
              paymentStatus: { $cond: [{ $gte: [{ $add: ['$paidAmount', delta] }, '$totalAmount'] }, 'paid', { $cond: [{ $gt: [{ $add: ['$paidAmount', delta] }, 0] }, 'partial', 'pending'] }] },
            },
          },
        ])
      )
    }
    if (body?.status !== undefined) set.status = asString(body.status, 20) === 'refunded' ? 'refunded' : 'received'
    if (body?.method !== undefined) set.method = asString(body.method, 20) || 'cash'
    if (body?.transactionId !== undefined) set.transactionId = asOptionalString(body.transactionId, 200)
    if (body?.notes !== undefined) set.notes = asOptionalString(body.notes, 500)
    if (body?.date !== undefined) set.date = asNumber(body.date) || doc.date

    await col.updateOne({ _id: ctx.params.id }, { $set: set })
    if (actor) void audit(actor.username, 'payment.updated', 'payments', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('payments.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await paymentsCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    await bookingsCollection().then((c) =>
      c.updateOne({ bookingId: doc.bookingId }, { $inc: { paidAmount: -doc.amount } })
    )
    if (actor) void audit(actor.username, 'payment.deleted', 'payments', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}