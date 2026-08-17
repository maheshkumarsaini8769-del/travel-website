import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { bookingsCollection, paymentsCollection } from '@/lib/db'
import { notify } from '@/lib/notify'
import { asString, asOptionalString, asNumber, asPhone, asBool, makeId } from '@/lib/util'
import { sanitizeBooking } from '@/lib/sanitize'
import { BOOKING_STATUSES, type BookingStatus, type PaymentStatus } from '@/lib/db'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('bookings.view')
  if (denied) return denied
  try {
    const col = await bookingsCollection()
    const doc = await col.findOne({ _id: ctx.params.id })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('bookings.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()

  try {
    const body = await req.json()
    const col = await bookingsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    const set: Record<string, unknown> = { updatedAt: Date.now() }

    if (body?.status !== undefined) {
      const status = asString(body.status, 20) as BookingStatus
      if (!BOOKING_STATUSES.includes(status)) return Response.json({ error: 'Invalid status' }, { status: 400 })
      set.status = status
      if (status === 'cancelled') {
        void notify('cancellation', 'Booking cancelled', `${existing.bookingId} — ${existing.customer.name}`, '/admin/bookings')
      }
      if (status === 'confirmed') {
        set.paymentStatus = existing.paidAmount > 0 ? 'partial' : 'pending'
      }
      if (actor) void audit(actor.username, 'booking.status_changed', 'bookings', ctx.params.id, { status })
    }

    if (body?.notes !== undefined) set.notes = asOptionalString(body.notes, 2000)
    if (body?.travelDate !== undefined) set.travelDate = asOptionalString(body.travelDate, 20)
    if (body?.totalAmount !== undefined) set.totalAmount = Math.max(0, asNumber(body.totalAmount))

    // Add a payment record + advance paidAmount
    if (body?.payment !== undefined && typeof body.payment === 'object') {
      const p = body.payment as Record<string, unknown>
      const amount = Math.max(0, asNumber(p.amount))
      if (amount > 0) {
        const method = asString(p.method, 20) || 'cash'
        const paymentId = makeId('PAY')
        const payments = await paymentsCollection()
        await payments.insertOne({
          _id: crypto.randomUUID(),
          paymentId,
          bookingId: existing.bookingId,
          bookingLabel: existing.bookingId,
          customerName: existing.customer.name,
          amount,
          method: method as 'cash' | 'upi' | 'bank' | 'card' | 'other',
          status: asString(p.status, 20) === 'refunded' ? 'refunded' : 'received',
          transactionId: asOptionalString(p.transactionId, 200),
          notes: asOptionalString(p.notes, 500),
          date: asNumber(p.date) || Date.now(),
          createdAt: Date.now(),
        })
        const newPaid = asString(p.status, 20) === 'refunded' ? existing.paidAmount - amount : existing.paidAmount + amount
        set.paidAmount = Math.max(0, newPaid)
        set.paymentStatus = (Math.max(0, newPaid) >= existing.totalAmount ? 'paid' : Math.max(0, newPaid) > 0 ? 'partial' : 'pending') as PaymentStatus
        if (actor) void audit(actor.username, 'payment.added', 'bookings', ctx.params.id, { amount })
        void notify('payment', 'Payment recorded', `${paymentId} — ₹${amount}`, '/admin/payments')
      }
    }

    if (body?.paidAmount !== undefined) {
      set.paidAmount = Math.max(0, asNumber(body.paidAmount))
      set.paymentStatus = (set.paidAmount as number) >= existing.totalAmount ? 'paid' : (set.paidAmount as number) > 0 ? 'partial' : 'pending'
    }

    await col.updateOne({ _id: ctx.params.id }, { $set: set })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('bookings.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await bookingsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    await paymentsCollection().then((c) => c.deleteMany({ bookingId: existing.bookingId }))
    if (actor) void audit(actor.username, 'booking.deleted', 'bookings', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
