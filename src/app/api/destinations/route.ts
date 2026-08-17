import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { destinationsCollection } from '@/lib/db'
import { getDestinations, listDatabaseDestinations } from '@/lib/data'
import { asString, asOptionalString, asStringArray, asBool, parseListParams } from '@/lib/util'

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  if (url.searchParams.get('all') === '1') {
    const denied = await requireAdmin('destinations.view')
    if (denied) return denied
    const { page, limit, q } = parseListParams(url)
    try {
      const docs = await listDatabaseDestinations()
      const filtered = q
        ? docs.filter((d) => `${d.name} ${d.description} ${d.slug}`.toLowerCase().includes(q.toLowerCase()))
        : docs
      const total = filtered.length
      const start = (page - 1) * limit
      return Response.json({ items: filtered.slice(start, start + limit), total })
    } catch {
      return Response.json({ items: [], total: 0 })
    }
  }

  const list = await getDestinations()
  return Response.json(list, { headers: { 'cache-control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('destinations.create')
  if (denied) return denied
  const actor = await getCurrentAdmin()

  try {
    const body = await req.json()
    const name = asString(body.name, 100)
    const slug = asString(body.slug, 60).toLowerCase().replace(/[^a-z0-9-]/g, '-') || name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (!slug) return Response.json({ error: 'Destination name or slug is required' }, { status: 400 })

    const col = await destinationsCollection()
    const existing = await col.findOne({ _id: slug })
    if (existing) return Response.json({ error: 'A destination with this slug already exists' }, { status: 409 })

    const now = Date.now()
    await col.insertOne({
      _id: slug,
      slug,
      name,
      tagline: asOptionalString(body.tagline, 200),
      description: asString(body.description, 5000),
      image: asString(body.image, 500),
      gallery: asStringArray(body.gallery),
      attractions: asStringArray(body.attractions),
      bestTime: asOptionalString(body.bestTime, 200),
      highlights: asStringArray(body.highlights),
      categories: asStringArray(body.categories).filter((c) => ['Rajasthan', 'India', 'International'].includes(c)),
      packageIds: asStringArray(body.packageIds),
      seoTitle: asOptionalString(body.seoTitle, 200),
      seoDescription: asOptionalString(body.seoDescription, 500),
      status: asString(body.status, 20) === 'draft' ? 'draft' : 'published',
      featured: asBool(body.featured),
      createdAt: now,
      updatedAt: now,
    })
    if (actor) void audit(actor.username, 'destination.created', 'destinations', slug)
    return Response.json({ ok: true, id: slug }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
