import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Sunsky Tourism — Explore More. Worry Less.',
  description:
    'Sunsky Tourism is Sikar, Rajasthan\'s trusted travel agency offering curated tour packages to Jaipur, Udaipur, Jaisalmer, Goa, Kashmir, Dubai and more. Book flights, hotels, holiday packages and [...]',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Sunsky Tourism — Explore More. Worry Less.',
    description:
      'Curated travel packages to Rajasthan, India and international destinations. Flights, hotels, tours and holiday packages at the best prices.',
    url: 'https://www.sunskytourism.in',
    siteName: 'Sunsky Tourism',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630, alt: 'Sunsky Tourism — Explore More Worry Less' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunsky Tourism — Explore More. Worry Less.',
    description:
      'Curated travel packages to Rajasthan, India and international destinations. Book at the best prices.',
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
      <Script 
        src="https://aistudio.zenuxs.site/inter/widget.js?token=zinter-8c86b5d3245341c2b4fda3c47242b42b"
        strategy="afterInteractive"
      />
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
      <TestimonialsSection />
      <ReviewSection />
      <CtaSection />
      <HomeContact />
    </>
  )
}
