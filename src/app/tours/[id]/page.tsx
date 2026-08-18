import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { tours, tourBySlug } from '@/data/tours'
import Gallery from '@/components/ui/Gallery'
import SectionHeading from '@/components/ui/SectionHeading'
import FaqAccordion from '@/components/ui/FaqAccordion'
import BookingPanel from '@/components/tours/BookingPanel'
import JsonLd from '@/components/seo/JsonLd'
import {
  Clock,
  Users,
  Languages,
  MapPin,
  Bus,
  CalendarClock,
  BadgeIndianRupee,
  XCircle,
  ShieldCheck,
  Accessibility,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'

interface Props {
  params: { id: string }
}

export function generateStaticParams() {
  return tours.map((t) => ({ id: t.id }))
}

export function generateMetadata({ params }: Props): Metadata {
  const tour = tourBySlug(params.id)
  if (!tour) return { title: 'Tour Not Found | Sunsky Tourism' }
  return {
    title: `${tour.title} | Sunsky Tourism`,
    description: `${tour.tagline} — ${tour.durationLabel} tour in ${tour.destination}. ${tour.priceLabel}. Book through Sunsky Tourism.`,
    alternates: { canonical: `/tours/${tour.id}` },
  }
}

export default function TourDetailPage({ params }: Props) {
  const tour = tourBySlug(params.id)
  if (!tour) notFound()

  const facts = [
    { icon: Clock, label: 'Duration', value: tour.durationLabel },
    { icon: MapPin, label: 'Destination', value: tour.destination },
    { icon: Users, label: 'Group size', value: tour.groupSize },
    { icon: Languages, label: 'Languages', value: tour.language },
    { icon: Bus, label: 'Pickup', value: tour.pickup },
    { icon: BadgeIndianRupee, label: 'Price', value: tour.priceLabel },
    { icon: CalendarClock, label: 'Availability', value: tour.availability },
    { icon: XCircle, label: 'Cancellation', value: tour.cancellation },
    { icon: Accessibility, label: 'Accessibility', value: tour.accessibility },
  ]

  const related = tours.filter((t) => t.id !== tour.id).slice(0, 3)

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: tour.title,
            description: `${tour.tagline} — ${tour.durationLabel} tour in ${tour.destination}. ${tour.priceLabel}. Book through Sunsky Tourism.`,
            image: [`https://www.sunskytourism.in${tour.images[0]}`],
            url: `https://www.sunskytourism.in/tours/${tour.id}`,
            brand: { '@type': 'Brand', name: 'Sunsky Tourism' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.sunskytourism.in',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Tours',
                item: 'https://www.sunskytourism.in/tours',
              },
              { '@type': 'ListItem', position: 3, name: tour.title },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tour.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />
      <section className="relative flex min-h-[55vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image src={tour.images[0]} alt={tour.title} fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-black/55 to-black/30" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.12),transparent_55%)]" aria-hidden="true" />
        </div>
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
            <Link href="/" className="transition-colors hover:text-orange-300">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <Link href="/tours" className="transition-colors hover:text-orange-300">
              Tours
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="font-medium text-orange-300">{tour.title}</span>
          </nav>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5" />
            {tour.destination} · {tour.category}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {tour.title}
          </h1>
          <p className="mt-3 text-lg font-medium text-orange-300 sm:text-xl">{tour.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <Clock className="h-4 w-4 text-orange-400" />
              {tour.durationLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <BadgeIndianRupee className="h-4 w-4 text-orange-400" />
              {tour.priceLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-orange-400" />
              {tour.tourType}
            </span>
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <SectionHeading align="left" eyebrow="Overview" title={tour.title} />
              <p className="-mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                {tour.overview}
              </p>

              <div className="mt-12">
                <SectionHeading align="left" eyebrow="Highlights" title="What makes it special." />
                <div className="-mt-8 grid gap-3 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-400" />
                      <span className="text-sm font-medium text-slate-200">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14">
                <SectionHeading align="left" eyebrow="Itinerary" title="How the day unfolds." />
                <div className="-mt-8 space-y-0">
                  {tour.itinerary.map((step, i) => (
                    <div key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
                      {i < tour.itinerary.length - 1 && (
                        <span className="absolute left-[17px] top-10 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-orange-400/40 to-white/5" aria-hidden="true" />
                      )}
                      <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-400/30 bg-[#0d0d10] text-sm font-bold text-orange-300">
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <p className="flex flex-wrap items-center gap-2.5">
                          <span className="text-base font-bold text-white">{step.title}</span>
                          {step.time && (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-orange-300">
                              {step.time}
                            </span>
                          )}
                        </p>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">Included</p>
                  <ul className="mt-5 space-y-3">
                    {tour.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">Not included</p>
                  <ul className="mt-5 space-y-3">
                    {tour.exclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-400">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">Best for</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tour.bestFor.map((b) => (
                      <span key={b} className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">Carry along</p>
                  <ul className="mt-4 space-y-2">
                    {tour.whatToCarry.map((c) => (
                      <li key={c} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-14">
                <SectionHeading align="left" eyebrow="FAQs" title="Good to know." />
                <div className="-mt-8">
                  <FaqAccordion items={tour.faqs} />
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Tour details</p>
                <ul className="mt-4 space-y-4">
                  {facts.map((fact) => (
                    <li key={fact.label} className="flex items-start gap-3.5">
                      <fact.icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{fact.label}</p>
                        <p className="mt-0.5 text-sm font-medium text-white">{fact.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <BookingPanel tour={tour} />
            </aside>
          </div>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="More Tours" title="You might also enjoy." />
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <Link
                key={t.id}
                href={`/tours/${t.id}`}
                className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    loading="lazy" decoding="async"
                    src={t.images[0]}
                    alt={t.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Clock className="h-3 w-3 text-orange-400" />
                    {t.durationLabel}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white">{t.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{t.destination}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
