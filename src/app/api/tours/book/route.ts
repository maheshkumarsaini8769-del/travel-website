import { NextRequest } from 'next/server'
import { bookingsCollection, customersCollection } from '@/lib/db'
import { notify } from '@/lib/notify'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body.name ?? '').trim()
    const phone = String(body.phone ?? '').trim().replace(/\D/g, '').slice(-10)
    const email = String(body.email ?? '').trim()
    const tourId = String(body.tourId ?? '').trim()
    const tourName = String(body.tourName ?? '').trim()
    const destination = String(body.destination ?? '').trim()
    const travelDate = String(body.travelDate ?? '').trim()
    const travellers = Math.max(1, Math.round(Number(body.travellers) || 2))
    const pricePerPerson = Math.max(0, Number(body.pricePerPerson) || 0)
    const notes = String(body.notes ?? '').trim()
    const cost = Math.max(0, Number(body.cost) || 0)

    if (!name || !phone) {
      return Response.json({ error: 'Name and phone are required' }, { status: 400 })
    }
    if (!tourName) {
      return Response.json({ error: 'Tour name is required' }, { status: 400 })
    }

    const col = await bookingsCollection()
    const customers = await customersCollection()
    const bookingId = 'TOUR-' + Date.now().toString(36).toUpperCase()

    const now = Date.now()
    await col.insertOne({
      _id: crypto.randomUUID(),
      bookingId,
      customer: { name, phone, email: email || undefined },
      packageRef: { id: tourId, name: tourName },
      destination: destination || undefined,
      travelDate: travelDate || undefined,
      travellers,
      adults: travellers,
      children: 0,
      totalAmount: pricePerPerson * travellers,
      paidAmount: 0,
      paymentStatus: 'pending',
      status: 'pending',
      source: 'website',
      notes: notes || `Tour booking: ${tourName}`,
      cost,
      createdAt: now,
      updatedAt: now,
    } as any)

    await customers.updateOne(
      { phone },
      {
        $set: { name, email: email || '', updatedAt: now },
        $setOnInsert: { _id: crypto.randomUUID(), phone, createdAt: now },
      },
      { upsert: true }
    )

    void notify(
      'booking',
      'New tour booking request',
      `${name} — ${tourName}${travelDate ? ` on ${travelDate}` : ''} (${travellers} guests)`,
      '/admin/bookings'
    )

    return Response.json({ ok: true, bookingId }, { status: 201 })
  } catch {
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
