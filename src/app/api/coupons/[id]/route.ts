import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { couponsCollection } from '@/lib/db'
import { sanitizeCoupon } from '@/lib/sanitize'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('coupons.view')
  if (denied) return denied
  try {
    const doc = await couponsCollection().then((c) => c.findOne({ _id: ctx.params.id }))
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('coupons.edit')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const col = await couponsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    const coupon = sanitizeCoupon({ ...existing, ...body })
    await col.updateOne({ _id: ctx.params.id }, { $set: { ...coupon, updatedAt: Date.now() } })
    if (actor) void audit(actor.username, 'coupon.updated', 'coupons', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = await requireAdmin('coupons.delete')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const col = await couponsCollection()
    const existing = await col.findOne({ _id: ctx.params.id })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await col.deleteOne({ _id: ctx.params.id })
    if (actor) void audit(actor.username, 'coupon.deleted', 'coupons', ctx.params.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}