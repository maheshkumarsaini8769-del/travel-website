import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import { ctaImages } from '@/data/images'
import AllReviewsList from '@/components/reviews/AllReviewsList'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'All Reviews | Sunsky Tourism',
  description: 'Read all verified traveller reviews from Sunsky Tourism — real experiences from real travellers.',
  alternates: { canonical: '/reviews' },
}

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
          <AllReviewsList />
        </div>
      </section>
    </>
  )
}