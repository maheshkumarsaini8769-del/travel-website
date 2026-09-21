import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { serviceImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'Taxi Service in Sikar | Airport Cabs, Outstation & Sightseeing Cars — Sunsky Tourism',
  description:
    'Reliable taxi service in Sikar, Rajasthan. Airport transfers to Jaipur/Delhi, outstation cabs to Khatu Shyam Ji, Salasar Balaji, Jaipur, and Rajasthan tour vehicle rentals.',
  alternates: { canonical: '/transportation' },
  openGraph: {
    title: 'Taxi Service in Sikar | Airport & Outstation Cabs — Sunsky Tourism',
    description:
      'Sanitized private AC cabs in Sikar. Dzire, Ertiga, Innova Crysta, Tempo Traveller for airport transfers, pilgrimage tours, and Rajasthan sightseeing.',
    url: 'https://www.sunskytourism.in/transportation',
    siteName: 'Sunsky Tourism',
    images: [{ url: serviceImages.transport, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Comfortable Road Travel',
  h1: 'Taxi Service in Sikar — Airport Transfers, Outstation Cabs & Tour Rentals',
  heroSubtitle:
    'Travel across Rajasthan and beyond in pristine, air-conditioned vehicles driven by professional highway chauffeurs. Punctual airport pickups, Khatu Shyam Ji / Salasar pilgrimage cabs, and multi-day tour rentals from Sikar.',
  heroImage: serviceImages.transport,
  canonicalUrl: '/transportation',
  serviceName: 'Transportation & Taxi Service',
  serviceDescription:
    'Professional taxi and car rental service in Sikar, Rajasthan offering Jaipur airport transfers, Delhi airport cabs, local Shekhawati sightseeing, outstation cabs, and Tempo Travellers.',
  directAnswer: {
    question: 'How to book a taxi service in Sikar with Sunsky Tourism?',
    answer:
      'To book a taxi in Sikar, simply call +91 94620 18302 or WhatsApp us with your pickup address, travel date, and destination. We provide instant vehicle confirmation with vehicle model options (Swift Dzire, Ertiga, Innova Crysta, or 12/17-seater Tempo Travellers).',
    details:
      'All our vehicles are commercially registered, fully insured, sanitized before every trip, and equipped with GPS. Our drivers are polite, non-smoking, and highly experienced on Rajasthan highways and night routes.',
  },
  overviewParagraphs: [
    'Whether you need an early morning airport drop from Sikar to Jaipur International Airport, a peaceful family pilgrimage to Khatu Shyam Ji and Salasar Balaji, or a dedicated vehicle for a multi-day Rajasthan royal tour, dependable transportation makes all the difference.',
    'At Sunsky Tourism, we provide transparent per-kilometer and fixed-route pricing with no hidden charges for driver food, tolls, or night driving allowances.',
    'From compact sedans for solo business travelers to spacious Toyota Innova Crystas and luxury Tempo Travellers for wedding groups and family vacations, our fleet is ready 24/7.',
  ],
  features: [
    {
      title: 'Punctual Doorstep Pickups',
      description: 'Your car arrives at your home, hotel, or Sikar Railway Junction 15 minutes before the scheduled departure time.',
    },
    {
      title: 'Clean, AC Maintained Vehicles',
      description: 'Air conditioning is guaranteed throughout the journey, with pristine interiors, functioning seatbelts, and ample boot luggage space.',
    },
    {
      title: 'Expert Verified Chauffeurs',
      description: 'Polite, police-verified drivers who know the safest routes, bypasses, clean highway washrooms, and best family restaurants.',
    },
    {
      title: 'Fixed Transparent Quotes',
      description: 'Toll taxes, state highway border permits, and driver charges are clearly spelled out before you depart.',
    },
  ],
  pricingPlans: [
    {
      title: 'Sikar to Jaipur Airport / City Drop',
      duration: 'One-Way / Same-Day Return',
      startingPrice: 'From ₹2,499 (Sedan)',
      description: 'Direct doorstep pickup in Sikar and drop at Jaipur International Airport (JAI) or Jaipur Junction.',
      inclusions: ['Private AC Sedan (Dzire/Etios)', 'Highway toll tax included', 'Professional driver', 'Direct non-stop transfer (approx. 2 hours)'],
    },
    {
      title: 'Khatu Shyam Ji & Salasar Balaji Darshan',
      duration: 'Same-Day Religious Circuit',
      startingPrice: 'From ₹3,199 (Sedan/SUV)',
      description: 'Comfortable day trip covering Khatu Shyam Ji and Salasar Balaji temples with waiting time included.',
      inclusions: ['Doorstep Sikar pickup & return', 'Waiting time at temple complexes', 'AC sedan or 7-seater Ertiga/Innova', 'Tolls and parking included'],
    },
    {
      title: 'Multi-Day Rajasthan Outstation Tour',
      duration: 'Per Day Basis',
      startingPrice: 'From ₹12 / km or ₹3,499 / day',
      description: 'Dedicated car and driver at your disposal for touring Jaipur, Jodhpur, Jaisalmer, Udaipur, Mount Abu, or Agra.',
      inclusions: ['Dedicated vehicle for all sightseeing', '250 km / day minimum billing', 'Night driver allowance', 'AC throughout Rajasthan highways'],
    },
  ],
  faqs: [
    {
      question: 'How long does a taxi take from Sikar to Jaipur Airport?',
      answer:
        'A taxi ride from Sikar to Jaipur International Airport takes approximately 2 to 2.5 hours (distance is ~125 km) via the smooth NH52 / Jaipur-Sikar 4-lane expressway. We recommend scheduling pickup at least 4.5 hours before your domestic flight departure.',
    },
    {
      question: 'What types of cars are available for rent in Sikar?',
      answer:
        'Our fleet includes 4-seater sedans (Maruti Swift Dzire, Toyota Etios), 6-to-7-seater MPVs (Maruti Ertiga, Toyota Innova, Innova Crysta), and 12, 17, and 26-seater luxury Tempo Travellers for larger tour and wedding groups.',
    },
    {
      question: 'Are night taxi services available for late arrivals at Jaipur or Delhi?',
      answer:
        'Yes, our taxi service operates 24 hours a day, 7 days a week. We track your flight arrival in real-time and have your driver waiting at the arrival exit, ensuring complete safety for late-night highway travel back to Sikar.',
    },
  ],
  relatedServices: [
    { title: 'Rajasthan Tour Packages', href: '/rajasthan-tour-packages' },
    { title: 'Flight Booking in Sikar', href: '/flight-booking' },
    { title: 'Hotel Booking in Sikar', href: '/hotel-booking' },
    { title: 'Tour Packages from Sikar', href: '/tour-packages' },
  ],
  relatedGuides: [
    { title: 'Rajasthan Trip Cost from Sikar', href: '/travel-guides/rajasthan-trip-cost-from-sikar', excerpt: 'Car rental and fuel cost breakdown for Rajasthan road trips.' },
  ],
}

export default function TransportationPage() {
  return <ServicePageTemplate {...pageData} />
}
