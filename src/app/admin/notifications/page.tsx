'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { Badge, Button, PageHeader, Spinner, useToast } from '@/components/admin/ui'

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: number
}

export default function AdminNotificationsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=50')
      if (res.ok) {
        const j = (await res.json()) as { items: Notification[]; unread: number }
        setItems(j.items ?? [])
        setUnread(j.unread ?? 0)
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const markRead = async (id?: string) => {
    const res = await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: id ? JSON.stringify({ id }) : undefined,
    })
    if (res.ok) {
      toast('success', id ? 'Marked read' : 'All marked read')
      void load()
    } else toast('error', 'Action failed — database not connected?')
  }

  const remove = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast('success', 'Deleted')
      void load()
    } else toast('error', 'Delete failed')
  }

  if (loading) return <Spinner label="Loading notifications…" />

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="System alerts — bookings, enquiries, reviews"
        actions={
          <Button variant="ghost" disabled={unread === 0} onClick={() => void markRead()}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read ({unread})
          </Button>
        }
      />
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">No notifications yet.</p>
        ) : (
          items.map((n) => (
            <div key={n._id} className={`flex items-start justify-between gap-4 rounded-2xl border p-4 ${n.read ? 'border-white/10 bg-white/[0.02]' : 'border-orange-400/25 bg-orange-500/[0.05]'}`}>
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 rounded-full p-2 ${n.read ? 'bg-white/5 text-slate-500' : 'bg-orange-500/15 text-orange-300'}`}>
                  <Bell className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{n.message}</p>
                  <p className="mt-1.5 text-[10px] text-slate-600">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge color={n.read ? 'slate' : 'orange'}>{n.read ? 'Read' : 'New'}</Badge>
                {!n.read && (
                  <button onClick={() => void markRead(n._id)} className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white" title="Mark read">
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
                <button onClick={() => void remove(n._id)} className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}