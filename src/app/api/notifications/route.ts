import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { notificationsCollection } from '@/lib/db'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('notifications.view')
  if (denied) return denied
  const limit = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get('limit') ?? 20) || 20))
  const unreadOnly = req.nextUrl.searchParams.get('unread') === '1'
  try {
    const col = await notificationsCollection()
    const filter = unreadOnly ? { read: false } : {}
    const [items, unread] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).limit(limit).toArray(),
      col.countDocuments({ read: false }),
    ])
    return Response.json({ items, unread })
  } catch {
    return Response.json({ items: [], unread: 0 })
  }
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin('notifications.view')
  if (denied) return denied
  try {
    const body = await req.json()
    const id = String(body?.id ?? '')
    const col = await notificationsCollection()
    if (id) {
      await col.updateOne({ _id: id }, { $set: { read: true } })
    } else {
      await col.updateMany({}, { $set: { read: true } })
    }
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}