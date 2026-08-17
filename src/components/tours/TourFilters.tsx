'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, MapPin, Users, ArrowUpRight, BadgeIndianRupee } from 'lucide-react'
import { tours, tourCategories, type TourCategory } from '@/data/tours'

const allLabel = 'All Tours' as const

export default function TourFilters() {
  const [active, setActive] = useState<TourCategory | typeof allLabel>(allLabel)

  const filtered = active === allLabel ? tours : tours.filter((t) => t.category === active)

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {([allLabel, ...tourCategories] as const).map((cat) => {
          const isActive = active === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                isActive ? 'text-white' : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:border-orange-400/30 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="tour-filter-active"
                  className="absolute inset-0 rounded-full border border-orange-400/40 bg-orange-500/15"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tour) => (
          <Link
            key={tour.id}
            href={`/tours/${tour.id}`}
            className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
          >
            <div className="relative h-60 overflow-hidden">
              <Image
                loading="lazy" decoding="async"
                src={tour.images[0]}
                alt={tour.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden="true" />
              <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                {tour.category}
              </span>
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-orange-300">
                  <Clock className="h-3.5 w-3.5" />
                  {tour.durationLabel}
                </p>
                <h3 className="mt-1 text-xl font-bold leading-snug text-white">{tour.title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <MapPin className="h-4 w-4 text-orange-400" />
                {tour.destination}
              </p>
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-400">{tour.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/25 bg-orange-500/10 px-3.5 py-1.5 text-xs font-semibold text-orange-300">
                  <BadgeIndianRupee className="h-3.5 w-3.5" />
                  {tour.priceLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  {tour.groupSize}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
