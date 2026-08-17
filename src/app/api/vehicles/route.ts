import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { vehiclesCollection } from '@/lib/db'
import { sanitizeVehicle } from '@/lib/sanitize'
import { parseListParams } from '@/lib/util'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('vehicles.view')
  if (denied) return denied
  const { page, limit, q } = parseListParams(req.nextUrl)
  try {
    const docs = await vehiclesCollection().then((c) => c.find().toArray())
    const filtered = q ? docs.filter((d) => `${d.name} ${d.type} ${d.registration ?? ''}`.toLowerCase().includes(q.toLowerCase())) : docs
    const total = filtered.length
    return Response.json({ items: filtered.slice((page - 1) * limit, (page - 1) * limit + limit), total })
  } catch {
    return Response.json({ items: [], total: 0 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('vehicles.create')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const vehicle = sanitizeVehicle(body)
    if (!vehicle.name) return Response.json({ error: 'Vehicle name is required' }, { status: 400 })
    const now = Date.now()
    const id = crypto.randomUUID()
    await vehiclesCollection().then((c) => c.insertOne({ ...vehicle, _id: id, createdAt: now, updatedAt: now }))
    if (actor) void audit(actor.username, 'vehicle.created', 'vehicles', id)
    return Response.json({ ok: true, id }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}