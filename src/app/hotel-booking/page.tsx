import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { serviceImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'Hotel Booking in Sikar | Verified Stays, Resorts & Heritage Havelis — Sunsky Tourism',
  description:
    'Book verified hotels, resorts, heritage havelis, and desert camps with Sunsky Tourism in Sikar. Best price guarantee, family-friendly properties, and zero hidden charges.',
  alternates: { canonical: '/hotel-booking' },
  openGraph: {
    title: 'Hotel Booking in Sikar | Verified Stays — Sunsky Tourism',
    description:
      'Verified hotels, resorts, and luxury stays across India & internationally with Sunsky Tourism Sikar. Clean rooms, transparent tariffs, and great locations.',
    url: 'https://www.sunskytourism.in/hotel-booking',
    siteName: 'Sunsky Tourism',
    images: [{ url: serviceImages.hotels, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Handpicked Accommodations',
  h1: 'Hotel Booking in Sikar — Verified Stays, Luxury Resorts & Heritage Havelis',
  heroSubtitle:
    'Stop gambling with misleading online hotel photos. Sunsky Tourism books only verified hotels, authentic heritage havelis, beachfront villas, and desert camps personally vetted for hygiene, security, and dining excellence.',
  heroImage: serviceImages.hotels,
  canonicalUrl: '/hotel-booking',
  serviceName: 'Hotel Booking',
  serviceDescription:
    'Trusted hotel booking service in Sikar, Rajasthan offering handpicked accommodations, heritage havelis, desert luxury camps, budget stays, and corporate group bookings.',
  directAnswer: {
    question: 'Why book hotels through Sunsky Tourism in Sikar?',
    answer:
      'Sunsky Tourism guarantees verified room quality, transparent pricing, and zero unpleasant arrival surprises. We maintain direct partnerships with leading hotel chains and boutique heritage properties across Rajasthan, India, and worldwide, securing contracted rates that frequently beat public online portal prices.',
    details:
      'We verify critical details before booking: reliable air conditioning, hot water, safe parking, clean linens, family security, and breakfast quality. If any issue arises during check-in, our team resolves it instantly with hotel management.',
  },
  overviewParagraphs: [
    'A bad hotel stay can ruin an otherwise wonderful vacation. Online reviews can be manipulated, and wide-angle photos often hide poor maintenance or inconvenient locations far from city attractions.',
    'At Sunsky Tourism in Sikar, our philosophy is simple: we only recommend accommodations where we would gladly stay ourselves. From royal heritage palaces in Jaipur and lakeside havelis in Udaipur to luxury Swiss tents in Jaisalmer, beachfront resorts in Goa, and 4-star hotels in Dubai, every property meets our strict standards.',
    'Whether you need an economical room for a business trip, a romantic suite for your honeymoon, or interconnected rooms for an extended family vacation, we match your preferences perfectly.',
  ],
  features: [
    {
      title: 'Verified Property Audits',
      description: 'We prioritize safety, cleanliness, linen hygiene, and actual guest satisfaction over inflated internet star ratings.',
    },
    {
      title: 'B2B Contracted Tariffs',
      description: 'Our volume partnerships allow us to pass on lower room rates and complimentary perks like free breakfast or room upgrades.',
    },
    {
      title: 'Specialized Heritage & Desert Stays',
      description: 'Experience living history in restored Rajasthani thikanas, Shekhawati fresco havelis, and desert camps.',
    },
    {
      title: 'Hassle-Free Check-in Guarantee',
      description: 'Your reservations are pre-confirmed directly with the front office manager so your room is ready the moment you arrive.',
    },
  ],
  pricingPlans: [
    {
      title: 'Budget & Comfortable Stays',
      duration: 'Per Room / Per Night',
      startingPrice: 'From ₹1,499 / night',
      description: 'Clean, safe, air-conditioned rooms in prime central locations with complimentary Wi-Fi and breakfast options.',
      inclusions: ['Sanitized room & attached bathroom', 'AC, TV, Wi-Fi & hot water', 'Complimentary breakfast available', 'Zero hidden service fees'],
    },
    {
      title: 'Heritage Havelis & Boutique Stays',
      duration: 'Per Room / Per Night',
      startingPrice: 'From ₹3,499 / night',
      description: 'Authentic royal Rajasthani architecture, courtyards, traditional decor, and signature hospitality in Jaipur, Udaipur, or Jodhpur.',
      inclusions: ['Historic property architecture', 'Welcome drink on arrival', 'Buffet breakfast included', 'Traditional cultural ambiance'],
    },
    {
      title: '5-Star Luxury & Beachfront Resorts',
      duration: 'Per Room / Per Night',
      startingPrice: 'From ₹6,999 / night',
      description: 'Premium luxury brand hotels, beachfront villas in Goa, mountain view chalets in Manali, and 4/5-star city hotels in Dubai.',
      inclusions: ['Swimming pool & fitness center access', 'Spacious luxury category rooms', 'Multi-cuisine breakfast buffet', 'Priority check-in & check-out'],
    },
  ],
  faqs: [
    {
      question: 'Can you book hotels in Sikar for visiting guests or weddings?',
      answer:
        'Yes, we book quality hotels, guest houses, and marriage resort rooms in Sikar for family functions, business visitors, and wedding groups with special bulk discounts.',
    },
    {
      question: 'What happens if the hotel does not match the confirmed details?',
      answer:
        'Sunsky Tourism stands behind every booking. If a property fails to deliver the promised room type or cleanliness, we intervene immediately to get an upgrade or relocate you to an equivalent or superior property at no extra cost.',
    },
    {
      question: 'Is breakfast included in the hotel rates?',
      answer:
        'Yes, we almost always recommend and book rooms on the CP plan (Continental Plan, including daily buffet breakfast) so you can start each morning refreshed without extra food bills.',
    },
  ],
  relatedServices: [
    { title: 'Flight Booking in Sikar', href: '/flight-booking' },
    { title: 'Rajasthan Tour Packages', href: '/rajasthan-tour-packages' },
    { title: 'Taxi Service in Sikar', href: '/transportation' },
    { title: 'All Tour Packages', href: '/tour-packages' },
  ],
  relatedGuides: [
    { title: 'Best Places to Visit in Rajasthan', href: '/travel-guides/best-places-to-visit-in-rajasthan', excerpt: 'Where to stay and what to see in Rajasthan.' },
  ],
}

export default function HotelBookingPage() {
  return <ServicePageTemplate {...pageData} />
}
