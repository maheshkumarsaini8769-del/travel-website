import { NextResponse } from 'next/server'
import { couponsCollection } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const code = (body.code as string).trim().toUpperCase()
    const bookingAmount = Number(body.bookingAmount) || 0

    if (!code) return NextResponse.json({ error: 'Please enter a coupon code' }, { status: 400 })

    const col = await couponsCollection()
    const coupon = await col.findOne({ code, active: true })

    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })

    if (coupon.expiry && coupon.expiry < Date.now()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    if (coupon.minBookingValue && bookingAmount < coupon.minBookingValue) {
      return NextResponse.json({ error: `Minimum booking amount is ₹${coupon.minBookingValue}` }, { status: 400 })
    }

    let discount = 0
    if (coupon.type === 'percent') {
      discount = Math.round((bookingAmount * coupon.value) / 100)
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
    } else {
      discount = coupon.value
    }

    discount = Math.min(discount, bookingAmount)

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}
