'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal } from 'lucide-react'
import { packages } from '@/data/packages'
import TiltCard from '@/components/ui/TiltCard'
import StarRating from '@/components/ui/StarRating'

const themes = ['All', 'Heritage', 'Honeymoon', 'Family', 'Adventure', 'Beach', 'Luxury', 'Nature']
const durations = [
  { label: 'Any duration', value: 'any' },
  { label: 'Up to 4 days', value: '4' },
  { label: '5–6 days', value: '56' },
  { label: '7+ days', value: '7' },
]
const sorts = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
]

const durationDays = (duration: string) => parseInt(duration.split(' ')[0], 10) || 0

export default function PackageFilters() {
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('All')
  const [duration, setDuration] = useState('any')
  const [sort, setSort] = useState('popular')

  const filtered = useMemo(() => {
    let list = [...packages]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.places.some((pl) => pl.toLowerCase().includes(q))
      )
    }
    if (theme !== 'All') {
      list = list.filter((p) => p.theme.some((t) => t.toLowerCase() === theme.toLowerCase()))
    }
    if (duration === '4') list = list.filter((p) => durationDays(p.duration) <= 4)
    if (duration === '56') list = list.filter((p) => durationDays(p.duration) >= 5 && durationDays(p.duration) <= 6)
    if (duration === '7') list = list.filter((p) => durationDays(p.duration) >= 7)
    if (sort === 'price-asc') list.sort((a, b) => a.pricePerPerson - b.pricePerPerson)
    if (sort === 'price-desc') list.sort((a, b) => b.pricePerPerson - a.pricePerPerson)
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'popular') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return list
  }, [query, theme, duration, sort])

  return (
    <div>
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
          <SlidersHorizontal className="h-4 w-4" />
          Filter your trip
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination or package..."
              className="w-full rounded-full border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors focus:border-orange-400/60"
            />
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60"
          >
            {themes.map((t) => (
              <option key={t} value={t} className="bg-[#0d0d0f]">
                Theme: {t}
              </option>
            ))}
          </select>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60"
          >
            {durations.map((d) => (
              <option key={d.value} value={d.value} className="bg-[#0d0d0f]">
                {d.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#0d0d0f]">
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 py-20 text-center">
          <p className="text-lg font-semibold text-white">No packages match your filters.</p>
          <p className="mt-2 text-sm text-slate-400">Try clearing the search or choosing a different theme.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg, i) => (
            <TiltCard key={pkg.id} className={i % 3 === 1 ? 'lg:mt-10' : ''}>
              <Link
                href={`/packages/${pkg.id}`}
                className="group block h-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    {Math.round(((pkg.originalPrice - pkg.pricePerPerson) / pkg.originalPrice) * 100)}% OFF
                  </span>
                  {pkg.featured ? (
                    <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
                      ★ Bestseller
                    </span>
                  ) : null}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-orange-300">
                    <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1">
                      {pkg.duration}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-slate-300">{pkg.region}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">{pkg.name}</h3>
                  <div className="mt-1.5">
                    <StarRating rating={pkg.rating} reviewCount={pkg.reviewCount} />
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-400">{pkg.tagline}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="text-xl font-bold text-white">
                        ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
                        <span className="ml-1.5 text-sm font-normal text-slate-500 line-through">
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{pkg.basis}</p>
                    </div>
                    <span className="rounded-full border border-orange-400/40 px-4 py-2 text-xs font-bold text-orange-300 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      View Tour
                    </span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  )
}
