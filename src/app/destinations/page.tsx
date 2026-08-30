import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import TiltCard from '@/components/ui/TiltCard'
import { destinations, type DestinationCategory } from '@/data/destinations'
import { ctaImages } from '@/data/images'
import { getSettings, waUrl } from '@/lib/settings'
import { ArrowUpRight, MapPin } from 'lucide-react'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Destinations | Sunsky Tourism',
  description:
    'Explore curated destinations across Rajasthan, India and the world — Jaipur, Udaipur, Jaisalmer, Goa, Kashmir, Dubai and more.',
  alternates: { canonical: '/destinations' },
}

const categoryOrder: DestinationCategory[] = ['Rajasthan', 'India', 'International']

export default async function DestinationsPage() {
  const settings = await getSettings()
  const b = settings.business
  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      items: destinations.filter((d) => d.category === cat),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="Where will you go next?"
        description="From Rajasthan\u2019s royal cities to beaches, mountains and global skylines — pick a place, and we plan the rest."
        image={ctaImages.cinematic}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'Destinations', url: '/destinations' }]} />

      {grouped.map(({ category, items }) => (
        <section key={category} className="relative pb-20 last:pb-32 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-4 sm:mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{category}</h2>
              <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((d, i) => (
                <TiltCard key={d.id} className={i % 3 === 1 ? 'lg:mt-10' : ''}>
                  <Link
                    href={`/destinations/${d.id}`}
                    className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        loading="lazy" decoding="async"
                        src={d.image}
                        alt={d.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                        {d.region}
                      </span>
                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                        <MapPin className="h-4 w-4 text-orange-400" />
                        {d.name}
                      </h3>
                      <p className="mt-1.5 text-sm font-medium text-orange-300">{d.tagline}</p>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{d.description}</p>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Can&apos;t decide?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Tell us what you are looking for — beach, mountains, heritage or international — and
              we will suggest the perfect destination for you.
            </p>
            <Link
              href={waUrl(b.whatsappPrimary, `Hi Sunsky Tourism, I'm interested in visiting your next destination. Please share details.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Ask for Suggestions
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
