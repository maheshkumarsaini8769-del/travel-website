import { NextResponse } from 'next/server'
import { couponsCollection } from '@/lib/db'

export async function GET() {
  try {
    const col = await couponsCollection()
    const now = Date.now()
    const coupons = await col
      .find({
        active: true,
        $or: [
          { expiry: { $exists: false } },
          { expiry: { $gt: now } },
        ],
      } as any)
      .project({ code: 1, type: 1, value: 1, minBookingValue: 1, maxDiscount: 1 })
      .toArray()
    return Response.json(coupons)
  } catch {
    return Response.json([])
  }
}
