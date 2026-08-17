'use client'

import { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, ConfirmDialog, PageHeader, useToast } from '@/components/admin/ui'

interface Review {
  _id: string
  name: string
  rating: number
  text: string
  packageName?: string
  approved: boolean
  featured: boolean
  createdAt: number
}

export default function AdminReviews() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Review | null>(null)

  const update = async (r: Review, patch: Partial<Review>) => {
    const res = await fetch(`/api/reviews/${r._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) toast('success', 'Review updated')
    else toast('error', 'Update failed — database not connected?')
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
          { key: 'createdAt', label: 'Date', render: (r) => <span className="text-xs text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '—'}</span> },
          { key: 'approved', label: 'Status', render: (r) => <Badge color={r.approved ? 'green' : 'amber'}>{r.approved ? 'Approved' : 'Pending'}</Badge> },
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
