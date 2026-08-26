'use client'

import { useState } from 'react'
import { Star, Trash2, MessageCircle, X } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, ConfirmDialog, PageHeader, useToast } from '@/components/admin/ui'

interface Review {
  _id: string
  name: string
  rating: number
  text: string
  packageName?: string
  phone?: string
  editedAt?: number
  approved: boolean
  featured: boolean
  createdAt: number
  reply?: string
  repliedAt?: number
}

export default function AdminReviews() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Review | null>(null)
  const [replyTo, setReplyTo] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyBusy, setReplyBusy] = useState(false)

  const update = async (r: Review, patch: Partial<Review>) => {
    const res = await fetch(`/api/reviews/${r._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) toast('success', 'Review updated')
    else toast('error', 'Update failed — database not connected?')
  }

  const submitReply = async () => {
    if (!replyTo || !replyText.trim()) return
    setReplyBusy(true)
    try {
      const res = await fetch(`/api/reviews/${replyTo._id}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText.trim() }),
      })
      if (res.ok) {
        toast('success', 'Reply saved')
        setReplyTo(null)
        setReplyText('')
      } else {
        const d = await res.json().catch(() => ({}))
        toast('error', d.error ?? 'Failed to save reply')
      }
    } catch {
      toast('error', 'Network error')
    } finally {
      setReplyBusy(false)
    }
  }

  const deleteReply = async (r: Review) => {
    const res = await fetch(`/api/reviews/${r._id}/reply`, { method: 'DELETE' })
    if (res.ok) toast('success', 'Reply removed')
    else toast('error', 'Failed to remove reply')
  }

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Testimonials from your travellers — approve the ones you want on the site" />
      <DataTable<Review>
        columns={[
          {
            key: 'name',
            label: 'Reviewer',
            render: (r) => (
              <div>
                <p className="font-semibold text-white">{r.name}</p>
                <p className="mt-0.5 text-xs text-amber-400">{'★'.repeat(r.rating ?? 0)}</p>
              </div>
            ),
          },
          { key: 'text', label: 'Review', render: (r) => <span className="max-w-[340px] truncate text-slate-400">{r.text}</span> },
          { key: 'packageName', label: 'Package', render: (r) => <span className="text-xs text-slate-500">{r.packageName || '—'}</span> },
          {
            key: 'phone',
            label: 'Phone',
            render: (r) => (
              <span className={`text-xs ${r.editedAt ? 'text-amber-400' : 'text-slate-500'}`}>
                +{r.phone || '—'}
                {r.editedAt ? ' (edited)' : ''}
              </span>
            ),
          },
          { key: 'createdAt', label: 'Date', render: (r) => <span className="text-xs text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '—'}</span> },
          { key: 'approved', label: 'Status', render: (r) => <Badge color={r.approved ? 'green' : 'amber'}>{r.approved ? 'Approved' : 'Pending'}</Badge> },
          {
            key: 'reply',
            label: 'Reply',
            render: (r) => r.reply ? (
              <div className="max-w-[200px]">
                <p className="truncate text-xs text-emerald-400">{r.reply}</p>
                <p className="text-[10px] text-slate-600">{r.repliedAt ? new Date(r.repliedAt).toLocaleDateString('en-IN') : ''}</p>
              </div>
            ) : (
              <span className="text-xs text-slate-600">No reply</span>
            ),
          },
        ]}
        fetchUrl={(page, q) => `/api/reviews?all=1&q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search reviews…"
        emptyTitle="No reviews yet"
        emptyHint="Reviews from the website landing page will appear here."
        actions={(r) => (
          <>
            {!r.approved && (
              <button onClick={() => update(r, { approved: true })} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400 transition-colors hover:bg-emerald-500/20" title="Approve">
                <CheckIcon />
              </button>
            )}
            <button
              onClick={() => {
                setReplyTo(r)
                setReplyText(r.reply ?? '')
              }}
              className={`rounded-lg border p-2 transition-colors ${r.reply ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/40'}`}
              title={r.reply ? 'Edit reply' : 'Reply to review'}
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => update(r, { featured: !r.featured })}
              className={`rounded-lg border p-2 transition-colors ${r.featured ? 'border-amber-400/40 bg-amber-500/10 text-amber-300' : 'border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40'}`}
              title={r.featured ? 'Remove featured' : 'Feature on homepage'}
            >
              <Star className={`h-3.5 w-3.5 ${r.featured ? 'fill-amber-300' : ''}`} />
            </button>
            <button onClick={() => setToDelete(r)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      />

      {/* Reply Dialog */}
      {replyTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setReplyTo(null)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0d10] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Reply to {replyTo.name}</h3>
              <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">Review:</p>
              <p className="mt-1 text-sm text-slate-300">&ldquo;{replyTo.text}&rdquo;</p>
              <p className="mt-2 text-xs text-amber-400">{'★'.repeat(replyTo.rating)}</p>
            </div>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply to this review..."
              className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60"
              autoFocus
            />
            <div className="mt-4 flex gap-3">
              {replyTo.reply && (
                <button
                  onClick={async () => {
                    await deleteReply(replyTo)
                    setReplyTo(null)
                    setReplyText('')
                  }}
                  className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
                >
                  Remove Reply
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => setReplyTo(null)}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitReply}
                disabled={replyBusy || !replyText.trim()}
                className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {replyBusy ? 'Saving…' : 'Save Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          const res = await fetch(`/api/reviews/${toDelete._id}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Review deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete review?"
        message={`Review by ${toDelete?.name} will be removed.`}
      />
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
