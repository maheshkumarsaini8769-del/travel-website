import { NextResponse } from 'next/server'
import { couponsCollection } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const col = await couponsCollection()
  const coupon = await col.findOne({ _id: new ObjectId(params.id) } as any)
  if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(coupon)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const col = await couponsCollection()

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

  await col.updateOne({ _id: new ObjectId(params.id) } as any, { $set: update })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const col = await couponsCollection()
  await col.deleteOne({ _id: new ObjectId(params.id) } as any)
  return NextResponse.json({ ok: true })
}
