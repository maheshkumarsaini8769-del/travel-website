import { NextResponse } from 'next/server'
import { couponsCollection } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const col = await couponsCollection()
    const now = Date.now()
    const coupons = await col
      .find({
        active: true,
        $or: [
          { expiry: { $exists: false } },
          { expiry: null },
          { expiry: 0 },
          { expiry: { $gt: now } },
        ],
      } as any)
      .project({ code: 1, type: 1, value: 1, minBookingValue: 1, maxDiscount: 1 })
      .toArray()
    return Response.json(coupons, { headers: { 'cache-control': 'no-store, no-cache, must-revalidate' } })
  } catch {
    return Response.json([])
  }
}
