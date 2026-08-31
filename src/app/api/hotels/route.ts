import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { hotelsCollection } from '@/lib/db'
import { getHotelsPublic } from '@/lib/data'
import { sanitizeHotel } from '@/lib/sanitize'
import { parseListParams } from '@/lib/util'

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  if (url.searchParams.get('all') === '1') {
    const denied = await requireAdmin('hotels.view')
    if (denied) return denied
    const { page, limit, q } = parseListParams(url)
    try {
      const docs = await hotelsCollection().then((c) => c.find().toArray())
      const filtered = q ? docs.filter((d) => `${d.name} ${d.location}`.toLowerCase().includes(q.toLowerCase())) : docs
      const total = filtered.length
      return Response.json({ items: filtered.slice((page - 1) * limit, (page - 1) * limit + limit), total })
    } catch {
      return Response.json({ items: [], total: 0 })
    }
  }
  try {
    const hotels = await getHotelsPublic()
    return Response.json(hotels, { headers: { 'cache-control': 'no-store' } })
  } catch {
    return Response.json([])
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('hotels.create')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const hotel = sanitizeHotel(body)
    if (!hotel.name) return Response.json({ error: 'Hotel name is required' }, { status: 400 })
    const now = Date.now()
    const id = crypto.randomUUID()
    await hotelsCollection().then((c) => c.insertOne({ ...hotel, _id: id, createdAt: now, updatedAt: now }))
    if (actor) void audit(actor.username, 'hotel.created', 'hotels', id)
    return Response.json({ ok: true, id }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}