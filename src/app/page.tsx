import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'

export const metadata: Metadata = {
  title: 'Sunsky Tourism | Travel Agency & Tour Packages in Sikar',
  description:
    'Sunsky Tourism is the premier travel agency in Sikar, Rajasthan. Offering curated Rajasthan tour packages, domestic India holidays, international trips, flight booking, hotels, and visa assistance. Plan your trip today!',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Sunsky Tourism | Travel Agency & Tour Packages in Sikar',
    description:
      'Curated Rajasthan tour packages, domestic holidays, international getaways, flights, hotels, and visa assistance from Sikar, Rajasthan.',
    url: 'https://www.sunskytourism.in',
    siteName: 'Sunsky Tourism',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630, alt: 'Sunsky Tourism — Travel Agency & Tour Packages in Sikar' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunsky Tourism | Travel Agency & Tour Packages in Sikar',
    description:
      'Best Rajasthan tour packages, flights, hotels, and visa assistance from Sikar, Rajasthan. Book at the best rates.',
    images: ['/images/hero.jpg'],
  },
}

const Marquee = dynamic(() => import('@/components/ui/Marquee'))
const DestinationsShowcase = dynamic(() => import('@/components/home/DestinationsShowcase'))
const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'))
const PackagesSection = dynamic(() => import('@/components/home/PackagesSection'))
const AboutPreview = dynamic(() => import('@/components/home/AboutPreview'))
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'))
const WhySunsky = dynamic(() => import('@/components/home/WhySunsky'))
const HomeQuickFacts = dynamic(() => import('@/components/home/HomeQuickFacts'))
const HomeFaqSection = dynamic(() => import('@/components/home/HomeFaqSection'))
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), { ssr: false })
const ReviewSection = dynamic(() => import('@/components/reviews/ReviewSection'), { ssr: false })
const CtaSection = dynamic(() => import('@/components/home/CtaSection'))
const HomeContact = dynamic(() => import('@/components/home/HomeContact'))

const marqueeItems = [
  'Jaipur',
  'Udaipur',
  'Jaisalmer',
  'Jodhpur',
  'Delhi',
  'Goa',
  'Kashmir',
  'Himachal',
  'Dubai',
  'Paris',
  'Singapore',
  'Bali',
  'Maldives',
  'Thailand',
]

export default function Home() {
  return (
    <>
      <Hero />
      <div className="border-y border-white/5 bg-white/[0.02] py-5">
        <Marquee items={marqueeItems} speed={38} />
      </div>
      <DestinationsShowcase />
      <ServicesSection />
      <PackagesSection />
      <AboutPreview />
      <ProcessSection />
      <WhySunsky />
      <HomeQuickFacts />
      <HomeFaqSection />
      <TestimonialsSection />
      <ReviewSection />
      <CtaSection />
      <HomeContact />
    </>
  )
}
