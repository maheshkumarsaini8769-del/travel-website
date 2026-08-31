import { NextRequest } from 'next/server'
import { couponsCollection } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'

async function findCoupon(id: string) {
  const col = await couponsCollection()
  if (ObjectId.isValid(id)) {
    const doc = await col.findOne({ _id: new ObjectId(id) } as any)
    if (doc) return doc
  }
  return col.findOne({ code: id.toUpperCase() } as any)
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const coupon = await findCoupon(params.id)
  if (!coupon) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(coupon)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await req.json()
  const col = await couponsCollection()

  const coupon = await findCoupon(params.id)
  if (!coupon) return Response.json({ error: 'Not found' }, { status: 404 })

  const update: Record<string, unknown> = {}
  if (body.code !== undefined) update.code = (body.code as string).trim().toUpperCase()
  if (body.type !== undefined) update.type = body.type
  if (body.value !== undefined) update.value = Number(body.value)
  if (body.minBookingValue !== undefined) update.minBookingValue = body.minBookingValue ? Number(body.minBookingValue) : undefined
  if (body.maxDiscount !== undefined) update.maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : undefined
  if (body.expiry !== undefined) update.expiry = body.expiry ? new Date(body.expiry).getTime() : undefined
  if (body.usageLimit !== undefined) update.usageLimit = body.usageLimit ? Number(body.usageLimit) : undefined
  if (body.perCustomerLimit !== undefined) update.perCustomerLimit = body.perCustomerLimit ? Number(body.perCustomerLimit) : undefined
  if (body.active !== undefined) update.active = body.active

  await col.updateOne({ _id: coupon._id }, { $set: update })
  return Response.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const col = await couponsCollection()
  const coupon = await findCoupon(params.id)
  if (!coupon) return Response.json({ error: 'Not found' }, { status: 404 })

  await col.deleteOne({ _id: coupon._id })
  return Response.json({ ok: true })
}
