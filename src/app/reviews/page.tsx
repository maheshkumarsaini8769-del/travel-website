import type { Metadata } from 'next'
import { Suspense } from 'react'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import { ctaImages } from '@/data/images'
import AllReviewsList from '@/components/reviews/AllReviewsList'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'All Reviews | Sunsky Tourism',
  description: 'Read all verified traveller reviews from Sunsky Tourism — real experiences from real travellers.',
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: 'All Reviews | Sunsky Tourism',
    description: 'Read verified traveller reviews from Sunsky Tourism.',
    url: 'https://www.sunskytourism.in/reviews',
    images: ['/images/hero.jpg'],
    locale: 'en_IN',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Traveller Reviews"
        title="What our travellers say."
        description="Every review is verified before publishing — only genuine feedback appears here."
        image={ctaImages.cinematic}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'Reviews', url: '/reviews' }]} />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="All Reviews"
            title="Verified traveller experiences."
            description="Read what our travellers have to say about their trips with Sunsky Tourism."
          />
          <Suspense fallback={<div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" /></div>}>
            <AllReviewsList />
          </Suspense>
        </div>
      </section>
    </>
  )
}