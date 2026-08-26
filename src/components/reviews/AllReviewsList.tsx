'use client'

import { useEffect, useState } from 'react'
import { Star, Quote, Loader2 } from 'lucide-react'
import SpotlightCard from '@/components/ui/SpotlightCard'

interface Review {
  _id: string
  name: string
  rating: number
  text: string
  packageName?: string
  createdAt: number
  reply?: string
}

export default function AllReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews', { cache: 'no-store' })
      .then((r) => r.json())
      .then((docs: Review[]) => {
        setReviews(Array.isArray(docs) ? docs : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <Quote className="mx-auto h-10 w-10 text-orange-500/30" />
        <p className="mt-4 text-sm text-slate-400">No verified reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((t) => (
        <SpotlightCard key={t._id} className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 hover:border-orange-400/25">
          <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              Verified
            </span>
          </div>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">&ldquo;{t.text}&rdquo;</p>
          {t.reply && (
            <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Sunsky Tourism Reply</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{t.reply}</p>
            </div>
          )}
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-sm font-bold text-white">{t.name}</p>
            <p className="mt-0.5 text-xs text-orange-400">{t.packageName || 'General feedback'}</p>
          </div>
        </SpotlightCard>
      ))}
    </div>
  )
}