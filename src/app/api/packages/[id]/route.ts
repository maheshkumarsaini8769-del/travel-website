import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getDb, packagesCollection } from '@/lib/db'
import { getPackageById } from '@/lib/data'
import type { TravelPackage } from '@/data/packages'
import { ObjectId } from 'mongodb'

function sanitizePackage(body: Record<string, unknown>) {
  const list = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x)) : String(v ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  const num = (v: unknown, fallback: number) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  return {
    id: String(body.id ?? '').trim(),
    name: String(body.name ?? '').trim(),
    duration: String(body.duration ?? '').trim(),
    nights: String(body.nights ?? '').trim(),
    region: String(body.region ?? '').trim(),
    categories: list(body.categories) as TravelPackage['categories'],
    theme: list(body.theme) as TravelPackage['theme'],
    tagline: String(body.tagline ?? '').trim(),
    description: String(body.description ?? '').trim(),
    overview: String(body.overview ?? '').trim(),
    pricePerPerson: num(body.pricePerPerson, 0),
    originalPrice: num(body.originalPrice, 0),
    currency: String(body.currency ?? '₹').trim() || '₹',
    basis: String(body.basis ?? '').trim(),
    validity: String(body.validity ?? '').trim(),
    rating: num(body.rating, 0),
    reviewCount: Math.round(num(body.reviewCount, 0)),
    image: String(body.image ?? '').trim(),
    gallery: list(body.gallery),
    highlights: list(body.highlights),
    places: list(body.places),
    activities: list(body.activities),
    itinerary: Array.isArray(body.itinerary)
      ? (body.itinerary as { day?: unknown; title?: unknown; text?: unknown }[]).map((d, i) => ({
          day: num(d.day, i + 1),
          title: String(d.title ?? '').trim(),
          text: String(d.text ?? '').trim(),
        }))
      : [],
    inclusions: list(body.inclusions),
    exclusions: list(body.exclusions),
    accommodation: String(body.accommodation ?? '').trim(),
    meals: String(body.meals ?? '').trim(),
    hotelCategories: String(body.hotelCategories ?? '').trim(),
    transportation: String(body.transportation ?? '').trim(),
    featured: Boolean(body.featured),
  }
}

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const pkg = await getPackageById(ctx.params.id)
  if (!pkg) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(pkg, { headers: { 'cache-control': 'no-store' } })
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const body = (await req.json()) as Record<string, unknown>
    const pkg = sanitizePackage(body)
    if (!pkg.name) return Response.json({ error: 'Package name is required' }, { status: 400 })

    const col = await packagesCollection()
    const now = new Date()
    const { id: _id, ...rest } = pkg
    void _id
    await col.updateOne(
      { _id: ctx.params.id },
      { $set: { ...rest, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    )
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const col = await packagesCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    const refs: string[] = [
      ...(Array.isArray(existing.gallery) ? existing.gallery : []),
      existing.image ? String(existing.image) : '',
    ]
      .map((s) => s.trim())
      .filter((s) => s.startsWith('/api/images/'))
      .map((s) => s.replace('/api/images/', ''))

    const db = await getDb()
    await col.deleteOne({ _id: ctx.params.id })
    if (refs.length > 0) {
      const ids = refs.map((r) => {
        try {
          return new ObjectId(r)
        } catch {
          return null
        }
      }).filter((x): x is ObjectId => x !== null)
      if (ids.length > 0) await db.collection('images').deleteMany({ _id: { $in: ids } })
    }
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}