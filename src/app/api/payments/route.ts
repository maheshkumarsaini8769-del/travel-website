import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { paymentsCollection, bookingsCollection } from '@/lib/db'
import { asString, asOptionalString, asNumber, asPhone, makeId, parseListParams, regexEscape } from '@/lib/util'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('payments.view')
  if (denied) return denied
  const { page, limit, q, from, to } = parseListParams(req.nextUrl)

  try {
    const col = await paymentsCollection()
    const filter: Record<string, unknown> = {}
    if (from || to) {
      filter.date = {}
      if (from) (filter.date as Record<string, unknown>).$gte = from
      if (to) (filter.date as Record<string, unknown>).$lte = to
    }
    if (q) {
      const rx = new RegExp(regexEscape(q), 'i')
      filter.$or = [{ paymentId: rx }, { customerName: rx }, { bookingId: rx }, { transactionId: rx }]
    }
    const [items, total] = await Promise.all([
      col.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ])
    const received = await col.aggregate([
      { $match: { status: 'received', ...(from || to ? { date: { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) } } : {}) } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]).toArray()
    return Response.json({ items, total, receivedTotal: received[0]?.total ?? 0 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('payments.create')
  if (denied) return denied
  const actor = await getCurrentAdmin()

  try {
    const body = await req.json()
    const amount = Math.max(1, asNumber(body.amount))
    const bookingId = asString(body.bookingId, 60)
    if (!bookingId) return Response.json({ error: 'Booking ID is required' }, { status: 400 })

    const booking = await bookingsCollection().then((c) => c.findOne({ bookingId }))
    if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 })

    const paymentId = makeId('PAY')
    const method = asString(body.method, 20) || 'cash'
    const now = Date.now()
    await paymentsCollection().then((c) =>
      c.insertOne({
        _id: crypto.randomUUID(),
        paymentId,
        bookingId,
        bookingLabel: bookingId,
        customerName: booking.customer.name,
        amount,
        method: method as 'cash' | 'upi' | 'bank' | 'card' | 'other',
        status: asString(body.status, 20) === 'refunded' ? 'refunded' : 'received',
        transactionId: asOptionalString(body.transactionId, 200),
        notes: asOptionalString(body.notes, 500),
        date: asNumber(body.date) || now,
        createdAt: now,
      })
    )

    const newPaid = Math.max(0, booking.paidAmount + amount)
    await bookingsCollection().then((c) =>
      c.updateOne({ bookingId }, { $set: { paidAmount: newPaid, paymentStatus: newPaid >= booking.totalAmount ? 'paid' : 'partial', updatedAt: now } })
    )
    if (actor) void audit(actor.username, 'payment.created', 'payments', paymentId, { bookingId, amount })
    return Response.json({ ok: true, paymentId }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}