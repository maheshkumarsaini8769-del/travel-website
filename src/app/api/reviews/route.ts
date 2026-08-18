import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { reviewsCollection } from '@/lib/db'
import { getReviews } from '@/lib/data'
import { notify } from '@/lib/notify'
import { asString, asOptionalString, asNumber, parseListParams } from '@/lib/util'

function normalizePhone(raw: unknown): string {
  return asString(raw, 20).replace(/\D/g, '')
}

function isValidPhone(phone: string): boolean {
  return phone.length >= 10 && phone.length <= 15
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  if (url.searchParams.get('all') === '1') {
    const denied = await requireAdmin('reviews.view')
    if (denied) return denied
    const { page, limit, q } = parseListParams(url)
    try {
      const docs = await reviewsCollection().then((c) => c.find().sort({ createdAt: -1 }).toArray())
      const filtered = q ? docs.filter((d) => `${d.name} ${d.text}`.toLowerCase().includes(q.toLowerCase())) : docs
      const total = filtered.length
      return Response.json({ items: filtered.slice((page - 1) * limit, (page - 1) * limit + limit), total })
    } catch {
      return Response.json({ items: [], total: 0 })
    }
  }

  // Own-review lookup for editing: ?phone=...
  const phone = url.searchParams.get('phone') ?? ''
  if (phone) {
    const cleaned = phone.replace(/\D/g, '')
    if (!isValidPhone(cleaned)) {
      return Response.json({ found: false, error: 'Enter a valid phone number' }, { status: 400 })
    }
    try {
      const col = await reviewsCollection()
      const doc = await col.findOne({ phone: cleaned })
      if (!doc) return Response.json({ found: false })
      return Response.json({
        found: true,
        review: {
          name: doc.name,
          rating: doc.rating,
          text: doc.text,
          packageId: doc.packageId ?? '',
          packageName: doc.packageName ?? '',
          approved: !!doc.approved,
        },
      })
    } catch {
      return Response.json({ error: 'Database unavailable' }, { status: 503 })
    }
  }

  // Public: approved reviews only (phone number is never exposed)
  const docs = await getReviews()
  const trimmed = docs.map(({ phone: _phone, ...rest }) => rest)
  return Response.json(trimmed, { headers: { 'cache-control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  // Public review submission — one review per phone number; resubmitting edits the existing one
  try {
    const body = await req.json()
    const name = asString(body.name, 120)
    const text = asString(body.text, 2000)
    const rating = Math.min(5, Math.max(1, Math.round(asNumber(body.rating))))
    const phone = normalizePhone(body.phone ?? '')

    if (!name || name.length < 2) return Response.json({ error: 'Name is required (at least 2 characters)' }, { status: 400 })
    if (!text || text.length < 10) return Response.json({ error: 'Review is too short (at least 10 characters)' }, { status: 400 })
    if (!isValidPhone(phone)) return Response.json({ error: 'A valid phone number is required — it is only used to verify you' }, { status: 400 })

    const col = await reviewsCollection()
    const packageId = asOptionalString(body.packageId, 100) ?? ''
    const packageName = asOptionalString(body.packageName, 200) ?? ''

    const existing = await col.findOne({ phone })

    if (existing) {
      await col.updateOne(
        { phone },
        {
          $set: {
            name,
            rating,
            text,
            packageId,
            packageName,
            approved: false,
            featured: false,
            editedAt: Date.now(),
          },
        }
      )
      return Response.json({ ok: true, edited: true })
    }

    await col.insertOne({
      _id: crypto.randomUUID(),
      name,
      rating,
      text,
      phone,
      packageId,
      packageName,
      approved: false,
      featured: false,
      createdAt: Date.now(),
    })
    void notify('review', 'New review awaiting approval', `${name} — ${rating} stars`, '/admin/reviews')
    return Response.json({ ok: true, edited: false }, { status: 201 })
  } catch (e) {
    console.error('[reviews POST]', e)
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}