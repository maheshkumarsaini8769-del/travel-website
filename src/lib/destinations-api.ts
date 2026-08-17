import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { destinationsCollection } from '@/lib/db'
import { getDestinationBySlug } from '@/lib/data'
import { asString, asOptionalString, asStringArray, asBool } from '@/lib/util'

export async function getDestinationApi(slug: string): Promise<Response> {
  const dest = await getDestinationBySlug(slug)
  if (!dest) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(dest, { headers: { 'cache-control': 'no-store' } })
}

export async function putDestinationApi(req: NextRequest, slug: string): Promise<Response> {
  const denied = await requireAdmin('destinations.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()

  try {
    const body = await req.json()
    const col = await destinationsCollection()
    const existing = await col.findOne({ _id: slug })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    await col.updateOne(
      { _id: slug },
      {
        $set: {
          name: asString(body.name ?? existing.name, 100),
          tagline: asOptionalString(body.tagline ?? existing.tagline, 200),
          description: asString(body.description ?? existing.description, 5000),
          image: asString(body.image ?? existing.image, 500),
          gallery: asStringArray(body.gallery ?? existing.gallery),
          attractions: asStringArray(body.attractions ?? existing.attractions),
          bestTime: asOptionalString(body.bestTime ?? existing.bestTime, 200),
          highlights: asStringArray(body.highlights ?? existing.highlights),
          categories: asStringArray(body.categories ?? existing.categories).filter((c) => ['Rajasthan', 'India', 'International'].includes(c)),
          packageIds: asStringArray(body.packageIds ?? existing.packageIds),
          seoTitle: asOptionalString(body.seoTitle ?? existing.seoTitle, 200),
          seoDescription: asOptionalString(body.seoDescription ?? existing.seoDescription, 500),
          status: asString(body.status ?? existing.status, 20) === 'draft' ? 'draft' : 'published',
          featured: asBool(body.featured ?? existing.featured),
          updatedAt: Date.now(),
        },
      }
    )
    if (actor) void audit(actor.username, 'destination.updated', 'destinations', slug)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function deleteDestinationApi(slug: string): Promise<Response> {
  const denied = await requireAdmin('destinations.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()

  try {
    const col = await destinationsCollection()
    const existing = await col.findOne({ _id: slug })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: slug })
    if (actor) void audit(actor.username, 'destination.deleted', 'destinations', slug)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
