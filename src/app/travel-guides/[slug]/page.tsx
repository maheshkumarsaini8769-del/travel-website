import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { guides, guideBySlug } from '@/data/guides'
import SectionHeading from '@/components/ui/SectionHeading'
import { whatsappPackage } from '@/lib/helpers'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Lightbulb, MessageCircle } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = guideBySlug(params.slug)
  if (!guide) return { title: 'Guide Not Found | Sunsky Tourism' }
  return {
    title: `${guide.title} | Sunsky Tourism`,
    description: guide.excerpt,
    alternates: { canonical: `/travel-guides/${guide.slug}` },
  }
}

export default function GuideDetailPage({ params }: Props) {
  const guide = guideBySlug(params.slug)
  if (!guide) notFound()

  const related = guides.filter((g) => g.slug !== guide.slug).slice(0, 2)

  return (
    <>
      <section className="relative flex min-h-[45vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image src={guide.image} alt={guide.title} fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-black/60 to-black/30" aria-hidden="true" />
        </div>
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-12 sm:px-6 sm:pb-16">
          <Link
            href="/travel-guides"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" />
            All Guides
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="rounded-full border border-orange-400/40 bg-orange-500/15 px-3.5 py-1.5 font-semibold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-md">
              {guide.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-orange-400" />
              {guide.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-orange-400" />
              Updated {guide.date}
            </span>
          </div>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
            {guide.title}
          </h1>
        </div>
      </section>

      <article className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-lg leading-relaxed text-slate-300">{guide.excerpt}</p>
          <div className="my-10 h-px bg-white/10" />

          {guide.sections.map((section, i) => (
            <div key={section.heading} className="mt-12 first:mt-0">
              <h2 className="flex items-center gap-3 text-xl font-bold text-white sm:text-2xl">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-400/40 bg-orange-500/10 text-sm font-bold text-orange-400">
                  {i + 1}
                </span>
                {section.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400">{section.body}</p>
              {section.list && (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {guide.tips.length > 0 ? (
            <div className="mt-14 rounded-[24px] border border-orange-400/20 bg-orange-500/10 p-7 sm:p-9">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300">
                <Lightbulb className="h-4 w-4" />
                Pro tips
              </p>
              <ul className="mt-4 space-y-3">
                {guide.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-16 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
            <SectionHeading
              eyebrow="Feeling inspired?"
              title="Let's plan this trip for you."
              description="Send us the dates and traveller count — we'll come back with a day-wise itinerary and a clear quote, usually within hours."
              className="mb-0"
            />
            <a
              href={whatsappPackage(`planning a trip based on the "${guide.title}" guide`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              Plan This Trip on WhatsApp
            </a>
          </div>

          {related.length > 0 ? (
            <div className="mt-14">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">Keep reading</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/travel-guides/${g.slug}`}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-orange-400/30"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400">{g.category}</p>
                    <h3 className="mt-2 font-bold leading-snug text-white">{g.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-all duration-300 group-hover:gap-2.5 group-hover:text-orange-300">
                      Read guide
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </>
  )
}
