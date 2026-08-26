import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { reviewsCollection } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin('reviews.edit')
  if (denied) return denied

  try {
    const body = await req.json()
    const reply = String(body?.reply ?? '')

    if (!reply || reply.length < 2) {
      return Response.json({ error: 'Reply must be at least 2 characters' }, { status: 400 })
    }

    const col = await reviewsCollection()
    const result = await col.updateOne(
      { _id: params.id },
      { $set: { reply, repliedAt: Date.now() } }
    )

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Review not found' }, { status: 404 })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin('reviews.edit')
  if (denied) return denied

  try {
    const col = await reviewsCollection()
    await col.updateOne(
      { _id: params.id },
      { $unset: { reply: '', repliedAt: '' } }
    )
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}