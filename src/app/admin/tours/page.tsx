'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Eye, Pencil, Loader2 } from 'lucide-react'
import { PageHeader, Badge } from '@/components/admin/ui'

interface TourItem {
  _id: string
  id: string
  slug: string
  title: string
  destination: string
  category: string
  tourType: string
  durationLabel: string
  price: number
  originalPrice: number
  cost: number
  twoWayPrice: number
}

export default function AdminTours() {
  const [tourList, setTourList] = useState<TourItem[]>([])
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState<TourItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/tours')
      .then((r) => r.json())
      .then((d) => { setTourList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (tour: TourItem) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/tours/${tour._id}`, { method: 'DELETE' })
      if (res.ok) {
        setTourList((prev) => prev.filter((t) => t._id !== tour._id))
      }
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Tours"
        subtitle="Manage tour activities and pricing"
        actions={
          <Link href="/admin/tours/new">
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              <Plus className="h-4 w-4" />
              New Tour
            </button>
          </Link>
        }
      />

      {loading ? (
        <div className="mt-12 flex justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : tourList.length === 0 ? (
        <div className="mt-12 text-center text-slate-500">No tours yet. Create your first tour!</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {tourList.map((tour) => (
            <div
              key={tour._id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-orange-400/20"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-white">{tour.title}</h3>
                  <Badge color="sky">{tour.category}</Badge>
                  <Badge color="slate">{tour.tourType}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-400">{tour.destination} · {tour.durationLabel}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-lg font-bold text-white">₹{tour.price.toLocaleString('en-IN')}</span>
                  {tour.originalPrice > tour.price && (
                    <span className="text-sm text-slate-500 line-through">₹{tour.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                  {tour.originalPrice > tour.price && (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      Save {Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                    </span>
                  )}
                  {(tour as any).cost > 0 && (
                    <>
                      <span className="text-xs text-slate-500">Cost: ₹{(tour as any).cost.toLocaleString('en-IN')}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tour.price > (tour as any).cost ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-400/30 bg-rose-500/10 text-rose-300'}`}>
                        {tour.price > (tour as any).cost ? `Profit ₹${(tour.price - (tour as any).cost).toLocaleString('en-IN')}` : `Loss ₹${((tour as any).cost - tour.price).toLocaleString('en-IN')}`}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/tours/${tour.id || tour._id}`}
                  target="_blank"
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white"
                  title="View"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/admin/tours/${tour._id}`}
                  className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2 text-sky-300 transition-colors hover:bg-sky-500/20"
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => setToDelete(tour)}
                  className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0f] p-6">
            <h3 className="text-lg font-bold text-white">Delete tour?</h3>
            <p className="mt-2 text-sm text-slate-400">
              &quot;{toDelete.title}&quot; will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(toDelete)}
                disabled={deleting}
                className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
