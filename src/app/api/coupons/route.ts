import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { couponsCollection } from '@/lib/db'
import { sanitizeCoupon } from '@/lib/sanitize'
import { parseListParams } from '@/lib/util'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('coupons.view')
  if (denied) return denied
  const { page, limit, q } = parseListParams(req.nextUrl)
  try {
    const docs = await couponsCollection().then((c) => c.find().toArray())
    const filtered = q ? docs.filter((d) => d.code.toLowerCase().includes(q.toLowerCase())) : docs
    const total = filtered.length
    return Response.json({ items: filtered.slice((page - 1) * limit, (page - 1) * limit + limit), total })
  } catch {
    return Response.json({ items: [], total: 0 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('coupons.create')
  if (denied) return denied
  const actor = await getCurrentAdmin()
  try {
    const body = await req.json()
    const coupon = sanitizeCoupon(body)
    if (!coupon.code || coupon.value <= 0) {
      return Response.json({ error: 'Coupon code and a positive value are required' }, { status: 400 })
    }
    const col = await couponsCollection()
    const existing = await col.findOne({ _id: coupon.code })
    if (existing) return Response.json({ error: 'Coupon code already exists' }, { status: 409 })
    await col.insertOne({ ...coupon, _id: coupon.code, usedCount: 0, createdAt: Date.now() })
    if (actor) void audit(actor.username, 'coupon.created', 'coupons', coupon.code)
    return Response.json({ ok: true }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}