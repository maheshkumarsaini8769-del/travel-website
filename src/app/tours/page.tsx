import Link from 'next/link'
import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import TourFilters from '@/components/tours/TourFilters'
import { ctaImages } from '@/data/images'
import { getSettings, waUrl } from '@/lib/settings'
import { MessageCircle } from 'lucide-react'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Tours & Activities | Sunsky Tourism',
  description:
    'Handpicked tours and activities across Rajasthan — heritage walks, desert safaris, boat rides, food tours and more. Book with local experts.',
  alternates: { canonical: '/tours' },
  openGraph: {
    title: 'Tours & Activities | Sunsky Tourism',
    description: 'Handpicked tours and activities across Rajasthan.',
    url: 'https://www.sunskytourism.in/tours',
    images: ['/images/udaipur.jpg'],
    locale: 'en_IN',
    type: 'website',
  },
}

export default async function ToursPage() {
  const settings = await getSettings()
  const b = settings.business
  return (
    <>
      <PageHero
        eyebrow="Tours & Activities"
        title="Experiences that feel handmade."
        description="Small-group and private tours across Rajasthan, India and beyond — each one run by local partners we trust and priced honestly on request."
        image={ctaImages.cinematic}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'Tours', url: '/tours' }]} />

      <section className="relative pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TourFilters />
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Don&apos;t see your kind of trip?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              We design private tours around you — your dates, your pace, your interests. Tell us
              what you love and we&apos;ll craft it.
            </p>
            <Link
              href={waUrl(b.whatsappPrimary, 'Hello Sunsky Tourism, I want to know more about your travel packages.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              Design My Tour
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
