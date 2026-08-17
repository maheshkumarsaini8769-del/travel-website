import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { customersCollection, bookingsCollection, leadsCollection, getDb } from '@/lib/db'
import { asString, asOptionalString, asPhone, parseListParams, regexEscape } from '@/lib/util'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('customers.view')
  if (denied) return denied

  const { page, limit, q } = parseListParams(req.nextUrl)
  try {
    const col = await customersCollection()
    const filter: Record<string, unknown> = {}
    if (q) {
      const rx = new RegExp(regexEscape(q), 'i')
      filter.$or = [{ name: rx }, { phone: rx }, { email: rx }]
    }
    const [docs, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ])

    // Enrich with booking stats
    const db = await getDb()
    const phones = docs.map((d) => d.phone)
    const bookings = await db
      .collection('bookings')
      .aggregate([
        { $match: { 'customer.phone': { $in: phones } } },
        { $group: { _id: '$customer.phone', count: { $sum: 1 }, spent: { $sum: '$paidAmount' }, pending: { $sum: { $subtract: ['$totalAmount', '$paidAmount'] } } } },
      ])
      .toArray()
    const stats = new Map(bookings.map((b) => [String(b._id), b]))

    const items = docs.map((d) => ({
      id: d._id,
      name: d.name,
      phone: d.phone,
      email: d.email,
      notes: d.notes,
      source: d.source,
      lastContactedAt: d.lastContactedAt,
      createdAt: d.createdAt,
      bookingCount: stats.get(d.phone)?.count ?? 0,
      totalSpent: stats.get(d.phone)?.spent ?? 0,
      pendingPayment: stats.get(d.phone)?.pending ?? 0,
    }))
    return Response.json({ items, total })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('customers.create')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const phone = asPhone(body.phone)
    if (!phone) return Response.json({ error: 'Phone number is required' }, { status: 400 })
    const col = await customersCollection()
    const existing = await col.findOne({ phone })
    if (existing) return Response.json({ error: 'Customer with this phone already exists' }, { status: 409 })

    const now = Date.now()
    await col.insertOne({
      _id: crypto.randomUUID(),
      name: asString(body.name, 120),
      phone,
      email: asOptionalString(body.email, 200),
      notes: asOptionalString(body.notes, 2000),
      source: asOptionalString(body.source, 100),
      createdAt: now,
      updatedAt: now,
    })
    if (actor) void audit(actor.username, 'customer.created', 'customers', phone)
    return Response.json({ ok: true }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}