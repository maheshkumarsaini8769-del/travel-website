'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Quote, PenLine, ChevronRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'

interface RealReview {
  _id?: string
  name: string
  packageName?: string
  text: string
  rating: number
  approved?: boolean
  featured?: boolean
  reply?: string
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<RealReview[]>([])

  useEffect(() => {
    let done = false
    fetch('/api/reviews', { cache: 'no-store' })
      .then((r) => r.json())
      .then((docs: RealReview[]) => {
        if (done || !Array.isArray(docs)) return
        const approved = docs.filter((d) => d && typeof d.text === 'string' && d.text.length > 0)
        setReviews(approved)
      })
      .catch(() => {})
    return () => { done = true }
  }, [])

  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Traveller Stories"
          title="What a Sunsky trip feels like."
          description={
            reviews.length > 0
              ? 'Reviews from travellers who actually travelled with us — every one is verified before publishing.'
              : 'Traveller reviews will appear here once approved by our team.'
          }
        />

        <div className="mb-10 text-center">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(249,115,22,0.45)]"
          >
            <PenLine className="h-4 w-4" /> Write a Review
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <Quote className="mx-auto h-10 w-10 text-orange-500/30" />
            <p className="mt-4 text-sm text-slate-400">No verified reviews yet. Be the first to share your experience!</p>
            <Link
              href="/feedback"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white"
            >
              <PenLine className="h-4 w-4" /> Share your experience
            </Link>
          </div>
        ) : (
          <>
            <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((t) => (
              <StaggerItem key={t._id ?? t.name + t.text.slice(0, 12)}>
                <SpotlightCard className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 hover:border-orange-400/25">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                        Verified
                      </span>
                      <Quote className="h-6 w-6 text-orange-500/40" />
                    </div>
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
              </StaggerItem>
              ))}
            </StaggerGroup>
            {reviews.length > 6 && (
              <div className="mt-10 text-center">
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-orange-400/50"
                >
                  View All {reviews.length} Reviews <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}