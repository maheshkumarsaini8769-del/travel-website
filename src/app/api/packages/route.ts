import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { packagesCollection } from '@/lib/db'
import { getPackages } from '@/lib/data'
import type { TravelPackage } from '@/data/packages'

export async function GET() {
  const list = await getPackages()
  return Response.json(list, {
    headers: { 'cache-control': 'no-store' },
  })
}

function sanitizePackage(body: Record<string, unknown>): TravelPackage {
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
    cost: num(body.cost, 0),
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

export async function POST(req: NextRequest) {
  const denied = requireAdmin()
  if (denied) return denied

  try {
    const body = (await req.json()) as Record<string, unknown>
    const pkg = sanitizePackage(body)
    if (!pkg.id) return Response.json({ error: 'Package id is required' }, { status: 400 })

    const col = await packagesCollection()
    const existing = await col.findOne({ _id: pkg.id })
    if (existing) return Response.json({ error: 'A package with this id already exists' }, { status: 409 })

    const now = new Date()
    await col.insertOne({ ...pkg, _id: pkg.id, createdAt: now, updatedAt: now })
    return Response.json({ ok: true, id: pkg.id }, { status: 201 })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}