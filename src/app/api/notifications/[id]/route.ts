import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { notificationsCollection } from '@/lib/db'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin('notifications.view')
  if (denied) return denied
  try {
    const col = await notificationsCollection()
    await col.deleteOne({ _id: params.id })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}