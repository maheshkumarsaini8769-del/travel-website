import { NextRequest } from 'next/server'
import { couponsCollection } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { parseListParams, regexEscape } from '@/lib/util'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('coupons.view')
  if (denied) return denied

  const { page, limit, q } = parseListParams(req.nextUrl)
  try {
    const col = await couponsCollection()
    const filter: Record<string, unknown> = {}
    if (q) {
      const rx = new RegExp(regexEscape(q), 'i')
      filter.$or = [{ code: rx }]
    }
    const [items, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ])
    return Response.json({ items, total })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin('coupons.manage')
  if (denied) return denied

  const body = await req.json()
  const code = (body.code as string).trim().toUpperCase()

  if (!code) return Response.json({ error: 'Code is required' }, { status: 400 })
  if (!body.type || !body.value) return Response.json({ error: 'Type and value are required' }, { status: 400 })

  const col = await couponsCollection()
  const exists = await col.findOne({ code })
  if (exists) return Response.json({ error: 'Coupon code already exists' }, { status: 409 })

  const coupon = {
    code,
    type: body.type as 'percent' | 'fixed',
    value: Number(body.value),
    minBookingValue: body.minBookingValue ? Number(body.minBookingValue) : undefined,
    maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
    expiry: body.expiry ? new Date(body.expiry).getTime() : undefined,
    usageLimit: body.usageLimit ? Number(body.usageLimit) : undefined,
    perCustomerLimit: body.perCustomerLimit ? Number(body.perCustomerLimit) : undefined,
    usedCount: 0,
    active: body.active !== false,
    createdAt: Date.now(),
  }

  const result = await col.insertOne(coupon as any)
  return Response.json({ ...coupon, _id: result.insertedId }, { status: 201 })
}
