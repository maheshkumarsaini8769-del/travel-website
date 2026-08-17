import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { reviewsCollection } from '@/lib/db'
import { getReviews } from '@/lib/data'
import { notify } from '@/lib/notify'
import { asString, asOptionalString, asNumber, parseListParams, regexEscape } from '@/lib/util'

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
  // Public: approved reviews only
  const docs = await getReviews()
  return Response.json(docs, { headers: { 'cache-control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  // Public review submission (featured toggle requires admin)
  try {
    const body = await req.json()
    const name = asString(body.name, 120)
    const text = asString(body.text, 2000)
    const rating = Math.min(5, Math.max(1, Math.round(asNumber(body.rating))))
    if (!name || !text || name.length < 2) return Response.json({ error: 'Name and review text are required' }, { status: 400 })
    if (text.length < 10) return Response.json({ error: 'Review is too short' }, { status: 400 })

    const col = await reviewsCollection()
    await col.insertOne({
      _id: crypto.randomUUID(),
      name,
      rating,
      text,
      packageId: asOptionalString(body.packageId, 100),
      packageName: asOptionalString(body.packageName, 200),
      approved: false,
      featured: false,
      createdAt: Date.now(),
    })
    void notify('review', 'New review awaiting approval', `${name} — ${rating} stars`, '/admin/reviews')
    return Response.json({ ok: true }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}