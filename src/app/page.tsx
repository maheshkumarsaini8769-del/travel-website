import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'

const Marquee = dynamic(() => import('@/components/ui/Marquee'))
const DestinationsShowcase = dynamic(() => import('@/components/home/DestinationsShowcase'))
const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'))
const PackagesSection = dynamic(() => import('@/components/home/PackagesSection'))
const AboutPreview = dynamic(() => import('@/components/home/AboutPreview'))
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'))
const WhySunsky = dynamic(() => import('@/components/home/WhySunsky'))
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'))
const ReviewSection = dynamic(() => import('@/components/reviews/ReviewSection'))
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
      <TestimonialsSection />
      <ReviewSection />
      <CtaSection />
      <HomeContact />
    </>
  )
}
