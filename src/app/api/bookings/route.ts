import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { bookingsCollection, customersCollection, paymentsCollection, couponsCollection } from '@/lib/db'
import { notify } from '@/lib/notify'
import { sanitizeBooking } from '@/lib/sanitize'
import { asNumber, asPhone, makeId, parseListParams, regexEscape } from '@/lib/util'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('bookings.view')
  if (denied) return denied

  const { page, limit, q, from, to } = parseListParams(req.nextUrl)
  const status = req.nextUrl.searchParams.get('status')
  try {
    const col = await bookingsCollection()
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (from || to) {
      filter.createdAt = {}
      if (from) (filter.createdAt as Record<string, unknown>).$gte = from
      if (to) (filter.createdAt as Record<string, unknown>).$lte = to
    }
    if (q) {
      const rx = new RegExp(regexEscape(q), 'i')
      filter.$or = [{ 'customer.name': rx }, { 'customer.phone': rx }, { bookingId: rx }, { 'packageRef.name': rx }]
    }
    const [items, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ])
    return Response.json({ items, total })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  // Public endpoint — website booking form. Rate-limit by simple IP bucket.
  try {
    const body = await req.json()
    const booking = sanitizeBooking(body)
    if (!booking.customer.name || !booking.customer.phone) {
      return Response.json({ error: 'Name and phone number are required' }, { status: 400 })
    }

    const col = await bookingsCollection()
    const customers = await customersCollection()
    const bookingId = makeId('SUNSKY')

    const now = Date.now()
    await col.insertOne({
      ...booking,
      _id: crypto.randomUUID(),
      bookingId,
      paymentStatus: booking.totalAmount > 0 && booking.paidAmount >= booking.totalAmount ? 'paid' : booking.paidAmount > 0 ? 'partial' : 'pending',
      status: 'pending',
      source: 'website',
      createdAt: now,
      updatedAt: now,
    })

    await customers.updateOne(
      { phone: booking.customer.phone },
      {
        $set: { name: booking.customer.name, email: booking.customer.email ?? '', updatedAt: now },
        $setOnInsert: { _id: crypto.randomUUID(), phone: booking.customer.phone, createdAt: now },
      },
      { upsert: true }
    )

    void notify(
      'booking',
      'New booking request',
      `${booking.customer.name} — ${booking.packageRef.name || 'Enquiry'}`,
      '/admin/bookings'
    )

    if (booking.couponCode) {
      try {
        const couponCol = await couponsCollection()
        await couponCol.updateOne({ code: booking.couponCode }, { $inc: { usedCount: 1 } })
      } catch {}
    }

    return Response.json({ ok: true, bookingId }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
