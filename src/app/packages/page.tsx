import Link from 'next/link'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import PackageFilters from '@/components/packages/PackageFilters'
import TrustBadges from '@/components/ui/TrustBadges'
import { ctaImages } from '@/data/images'
import { getSettings, waUrl } from '@/lib/settings'
import { ArrowRight } from 'lucide-react'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Travel Packages | Sunsky Tourism',
  description:
    'Ready-made and customisable tour packages — Rajasthan heritage, Goa holidays, Kashmir escapes, Dubai experiences and Himachal adventures. Clear per-person pricing and no hidden charges.',
  alternates: { canonical: '/packages' },
}

export default async function PackagesPage() {
  const settings = await getSettings()
  const b = settings.business
  return (
    <>
      <PageHero
        eyebrow="Tour Packages"
        title="Trips, planned down to the last detail."
        description="Handcrafted packages across India and the world — filter by theme, duration or budget. Every one customisable to your dates."
        image={ctaImages.cinematic}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'Packages', url: '/packages' }]} />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TrustBadges className="mb-10" />
          <PackageFilters />
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Want a custom package?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Every package here can be reshaped — dates changed, hotels upgraded, places swapped.
              Or describe your dream trip and we will build it from scratch.
            </p>
            <Link
              href={waUrl(b.whatsappPrimary, `Hello Sunsky Tourism, I want details about a custom tour package.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Design My Package
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
