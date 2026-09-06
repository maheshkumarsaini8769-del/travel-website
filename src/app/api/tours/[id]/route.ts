import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { toursCollection } from '@/lib/db'

function sanitizeTour(body: Record<string, unknown>) {
  const list = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x)) : []
  const num = (v: unknown, fallback: number) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  return {
    id: String(body.id ?? '').trim(),
    slug: String(body.slug ?? body.id ?? '').trim(),
    title: String(body.title ?? '').trim(),
    destinationId: String(body.destinationId ?? '').trim(),
    destination: String(body.destination ?? '').trim(),
    category: String(body.category ?? 'Heritage').trim(),
    durationLabel: String(body.durationLabel ?? '').trim(),
    hours: num(body.hours, 3),
    tourType: String(body.tourType ?? 'Private or Group').trim() as 'Private' | 'Group' | 'Private or Group',
    language: String(body.language ?? 'English, Hindi').trim(),
    pickup: String(body.pickup ?? '').trim(),
    groupSize: String(body.groupSize ?? '').trim(),
    price: num(body.price, 0),
    originalPrice: num(body.originalPrice, 0),
    twoWayPrice: num(body.twoWayPrice, 0),
    cost: num(body.cost, 0),
    priceLabel: String(body.priceLabel ?? '').trim(),
    availability: String(body.availability ?? 'Daily').trim(),
    cancellation: String(body.cancellation ?? '').trim(),
    meetingPoint: String(body.meetingPoint ?? '').trim(),
    accessibility: String(body.accessibility ?? '').trim(),
    tagline: String(body.tagline ?? '').trim(),
    description: String(body.description ?? '').trim(),
    overview: String(body.overview ?? '').trim(),
    images: list(body.images),
    highlights: list(body.highlights),
    itinerary: Array.isArray(body.itinerary)
      ? (body.itinerary as Record<string, unknown>[]).map((d) => ({
          title: String(d.title ?? '').trim(),
          time: String(d.time ?? '').trim(),
          text: String(d.text ?? '').trim(),
        }))
      : [],
    inclusions: list(body.inclusions),
    exclusions: list(body.exclusions),
    bestFor: list(body.bestFor),
    whatToCarry: list(body.whatToCarry),
    faqs: Array.isArray(body.faqs)
      ? (body.faqs as Record<string, unknown>[]).map((f) => ({
          question: String(f.question ?? '').trim(),
          answer: String(f.answer ?? '').trim(),
        }))
      : [],
  }
}

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const col = await toursCollection()
    const tour = await col.findOne({ _id: ctx.params.id })
    if (!tour) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(tour)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = (await req.json()) as Record<string, unknown>
    const tour = sanitizeTour(body)
    if (!tour.title) return Response.json({ error: 'Tour title is required' }, { status: 400 })

    const col = await toursCollection()
    const now = Date.now()
    await col.updateOne(
      { _id: ctx.params.id },
      { $set: { ...tour, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    )
    if (actor) void audit(actor.username, 'tour.updated', 'tours', ctx.params.id)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await toursCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'tour.deleted', 'tours', ctx.params.id)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
