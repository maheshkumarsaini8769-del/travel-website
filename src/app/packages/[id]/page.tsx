import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPackageById, getPackages } from '@/lib/data'
import { destinationExtras } from '@/data/destinations'
import Gallery from '@/components/ui/Gallery'
import SectionHeading from '@/components/ui/SectionHeading'
import StarRating from '@/components/ui/StarRating'
import BookingWidget from '@/components/packages/BookingWidget'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { whatsappPackage } from '@/lib/helpers'
import { mapsUrl } from '@/data/contact'
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  Clock,
  MapPin,
  Navigation,
  Plane,
  TrainFront,
  Sparkles,
  UtensilsCrossed,
  X,
} from 'lucide-react'

interface Props {
  params: { id: string }
}

export const dynamic = 'force-dynamic'

const extraKeyByRegion: Record<string, string> = {
  Rajasthan: 'jaipur',
  Goa: 'goa',
  Kashmir: 'kashmir',
  Himachal: 'himachal',
  Dubai: 'dubai',
  International: 'international',
}

const reachIcons = [Plane, TrainFront, CarFront] as const
const reachLabels = ['By Air', 'By Rail', 'By Road']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageById(params.id)
  if (!pkg) return { title: 'Package Not Found | Sunsky Tourism' }
  return {
    title: `${pkg.name} | Sunsky Tourism`,
    description: `${pkg.name} — ${pkg.tagline}. ${pkg.duration} tour covering ${pkg.places.join(
      ', '
    )} from ₹${pkg.pricePerPerson.toLocaleString('en-IN')} per person. Book with Sunsky Tourism, Sikar.`,
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const pkg = await getPackageById(params.id)
  if (!pkg) notFound()

  const extra = destinationExtras[extraKeyByRegion[pkg.region] ?? 'international']
  const reach = extra ? [extra.howToReach.air, extra.howToReach.rail, extra.howToReach.road] : []
  const savings = Math.round(((pkg.originalPrice - pkg.pricePerPerson) / pkg.originalPrice) * 100)
  const all = await getPackages()
  const related = all.filter((p) => p.id !== pkg.id).slice(0, 3)

  return (
    <>
      <section className="relative flex min-h-[55vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img src={pkg.image} alt={pkg.name} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-black/50 to-black/30" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.12),transparent_55%)]" aria-hidden="true" />
        </div>
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" />
            All Packages
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {pkg.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-orange-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-orange-300" />
              {pkg.region}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-orange-300" />
              {pkg.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <BedDouble className="h-3.5 w-3.5 text-orange-300" />
              {pkg.hotelCategories}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {pkg.name}
          </h1>
          <p className="mt-4 text-lg font-medium text-orange-300 sm:text-xl">{pkg.tagline}</p>
          <div className="mt-5">
            <StarRating rating={pkg.rating} reviewCount={pkg.reviewCount} />
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <SectionHeading align="left" eyebrow="About the Tour" title={pkg.name} />
              <p className="-mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                {pkg.overview}
              </p>

              <div className="mt-12">
                <SectionHeading align="left" eyebrow="Day-by-Day" title="Your itinerary." />
                <div className="-mt-8 space-y-0">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="relative flex gap-5 pb-8">
                      <div className="flex flex-col items-center">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange-400/40 bg-[#0d0d0f] text-sm font-bold text-orange-400">
                          {String(day.day).padStart(2, '0')}
                        </span>
                        {day.day < pkg.itinerary.length ? (
                          <span className="mt-2 w-px flex-1 bg-gradient-to-b from-orange-500/40 to-transparent" aria-hidden="true" />
                        ) : null}
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                        <h3 className="text-lg font-bold text-white">{day.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">{day.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                <div className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/[0.05] p-7 sm:p-8">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                    <Check className="h-4 w-4" />
                    Inclusions
                  </p>
                  <ul className="mt-5 space-y-3">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/[0.05] p-7 sm:p-8">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-400">
                    <X className="h-4 w-4" />
                    Exclusions
                  </p>
                  <ul className="mt-5 space-y-3">
                    {pkg.exclusions.map((exc) => (
                      <li key={exc} className="flex items-start gap-2.5 text-sm text-slate-400">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/70" />
                        {exc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                  <CalendarDays className="h-5 w-5 text-orange-400" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Duration</p>
                  <p className="mt-1 font-bold text-white">{pkg.duration}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{pkg.validity}</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                  <UtensilsCrossed className="h-5 w-5 text-orange-400" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Meals</p>
                  <p className="mt-1 text-sm font-medium text-white">{pkg.meals}</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                  <CarFront className="h-5 w-5 text-orange-400" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Transport</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-white">{pkg.transportation}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                    Places covered
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {pkg.places.map((place) => (
                      <span
                        key={place}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200"
                      >
                        <MapPin className="h-3.5 w-3.5 text-orange-400" />
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                    Activities
                  </p>
                  <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {pkg.activities.map((a) => (
                      <li key={a} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <Check className="h-4 w-4 shrink-0 text-orange-400" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                  Tour highlights
                </p>
                <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {pkg.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Sparkles className="h-4 w-4 shrink-0 text-orange-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {extra ? (
                <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                    Getting there & ideal duration
                  </p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">Ideal duration</p>
                      <p className="mt-1 text-sm font-semibold text-white">{extra.idealDuration}</p>
                      <p className="mt-4 text-xs text-slate-500">From Sikar</p>
                      <p className="mt-1 text-sm font-semibold text-white">{extra.distanceFromSikar}</p>
                    </div>
                    <div className="space-y-4">
                      {reach.map((r, i) => {
                        const Icon = reachIcons[i]
                        return (
                          <div key={reachLabels[i]} className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-sm font-bold text-white">{reachLabels[i]}</p>
                              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{r}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-12">
                <SectionHeading align="left" eyebrow="Gallery" title="Tour visuals." />
                <div className="-mt-8">
                  <Gallery images={pkg.gallery} alt={pkg.name} />
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="lg:sticky lg:top-24">
                <BookingWidget pkg={pkg} />
                <p className="mt-3 text-center text-[11px] text-slate-500">
                  Save {savings}% vs regular prices on this package.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                Need a different route?
              </p>
              <p className="mt-2 max-w-xl text-lg font-semibold text-white">
                We customise every package — dates, stays, cities and budget.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={whatsappPackage(pkg.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Customise This Tour
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:border-orange-400/50"
              >
                <Navigation className="h-4 w-4 text-orange-400" />
                Visit Our Office
              </a>
            </div>
          </div>

          <SectionHeading
            eyebrow="More Tours"
            title="You may also like."
            className="mt-20"
          />
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <Link
                  href={`/packages/${p.id}`}
                  className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      loading="lazy" decoding="async"
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                    <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <Clock className="h-3 w-3 text-orange-300" />
                      {p.duration}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  )
}
