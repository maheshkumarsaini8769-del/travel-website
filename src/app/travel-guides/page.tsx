import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { guides } from '@/data/guides'
import { ctaImages } from '@/data/images'
import { getSettings, waUrl } from '@/lib/settings'
import { ArrowUpRight, Clock3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Travel Guides | Sunsky Tourism',
  description:
    'Honest, practical travel guides — best time to visit, itinerary ideas, food guides and family travel tips from the team behind Sunsky Tourism, Sikar.',
  alternates: { canonical: '/travel-guides' },
}

export default async function TravelGuidesPage() {
  const settings = await getSettings()
  const b = settings.business
  return (
    <>
      <PageHero
        eyebrow="Travel Guides"
        title="Travel smarter, not harder."
        description="No fluff, no copied content — practical guides written by travellers for travellers, to help you plan trips across Rajasthan, India and beyond."
        image={ctaImages.cinematic}
      />

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <StaggerItem key={g.slug}>
                <Link
                  href={`/travel-guides/${g.slug}`}
                  className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      loading="lazy" decoding="async"
                      src={g.image}
                      alt={g.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                      {g.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-orange-300">
                      <Clock3 className="h-3.5 w-3.5" />
                      {g.readTime}
                    </p>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-white">{g.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{g.excerpt}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-400">
                      Read guide
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-16 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Want answers specific to your trip?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Ask us directly on WhatsApp — real humans from Sunsky Tourism reply with honest advice, no scripts.
            </p>
            <Link
              href={waUrl(b.whatsappPrimary, 'Hello Sunsky Tourism, I want to know more about your travel packages.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Ask a Travel Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
