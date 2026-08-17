import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { reviewsCollection } from '@/lib/db'
import { asBool } from '@/lib/util'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('reviews.view')
  if (denied) return denied
  try {
    const doc = await reviewsCollection().then((c) => c.findOne({ _id: ctx.params.id }))
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('reviews.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const col = await reviewsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    const set: Record<string, unknown> = {}
    if (body?.approved !== undefined) set.approved = asBool(body.approved)
    if (body?.featured !== undefined) set.featured = asBool(body.featured)
    await col.updateOne({ _id: ctx.params.id }, { $set: set })
    if (actor) void audit(actor.username, 'review.updated', 'reviews', ctx.params.id, set)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('reviews.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await reviewsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'review.deleted', 'reviews', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}