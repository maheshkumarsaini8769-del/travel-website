import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { destinationImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'International Tour Packages from Sikar | Dubai, Bali, Thailand — Sunsky Tourism',
  description:
    'Plan international tour packages from Sikar with Sunsky Tourism. Customized overseas holidays to Dubai, Thailand, Bali, Singapore, and Maldives with flights, visas, and luxury stays.',
  alternates: { canonical: '/international-tour-packages' },
  openGraph: {
    title: 'International Tour Packages | Sunsky Tourism Sikar',
    description:
      'All-inclusive foreign vacations from Sikar: Dubai, Thailand, Bali, Singapore, Maldives. Visa, flights, 4-star hotels, and tours.',
    url: 'https://www.sunskytourism.in/international-tour-packages',
    siteName: 'Sunsky Tourism',
    images: [{ url: destinationImages.dubai, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Worldwide Vacations',
  h1: 'International Tour Packages from Sikar — Flights, Visas & Luxury Stays',
  heroSubtitle:
    'Step out into the world with complete peace of mind. All-inclusive overseas vacations to Dubai, Southeast Asia, island paradises, and Europe planned by trusted travel professionals in Sikar.',
  heroImage: destinationImages.dubai,
  canonicalUrl: '/international-tour-packages',
  serviceName: 'International Tour Packages',
  serviceDescription:
    'Customized international holiday packages departing from Sikar/Jaipur/Delhi covering Dubai, Thailand, Bali, Singapore, Maldives, and Europe with flight ticketing, visa assistance, and luxury hotels.',
  directAnswer: {
    question: 'How do international tour packages work with Sunsky Tourism in Sikar?',
    answer:
      'Sunsky Tourism handles your complete foreign vacation from Sikar. We manage tourist visa processing (e.g. UAE Dubai visas, Thailand e-visas), book international flight tickets departing from Jaipur (JAI) or Delhi (DEL), reserve verified 4-star and 5-star hotels, coordinate private airport transfers, and pre-book famous sightseeing tickets like the Burj Khalifa or Universal Studios.',
    details:
      'We also assist with travel insurance, international SIM cards, currency exchange guidance, and round-the-clock emergency telephone support while you are abroad.',
  },
  overviewParagraphs: [
    'Traveling internationally for the first time or planning an unforgettable family holiday abroad requires meticulous attention to visas, flight connections, hotel quality, and local transportation.',
    'At Sunsky Tourism in Sikar, we take the complexity out of international travel. Whether it is enjoying high-octane desert safaris and skyline views in Dubai, relaxing in private pool villas in Bali, island hopping in Thailand, or exploring modern marvels in Singapore, we deliver flawless travel experiences.',
    'Our international holiday packages are tailored for Indian travelers, ensuring convenient dining with Indian vegetarian/Jain options, trusted English-speaking guides, and transparent pricing with no hidden currency surprises.',
  ],
  features: [
    {
      title: 'Full Visa Assistance Included',
      description: 'We process tourist visas, document checklists, photo specifications, and appointments for Dubai, Schengen, Singapore, and Thailand.',
    },
    {
      title: 'Flights from Jaipur & Delhi',
      description: 'Convenient departures via direct or seamless connecting international flights with airport transfer assistance from Sikar.',
    },
    {
      title: 'Indian-Friendly Dining & Stays',
      description: 'We carefully pick properties near Indian restaurants and vegetarian options so you feel completely at home abroad.',
    },
    {
      title: 'Pre-Booked Skip-The-Line Passes',
      description: 'Access top global landmarks such as Burj Khalifa 124th floor, Dubai Miracle Garden, and Universal Studios Singapore without standing in line.',
    },
  ],
  pricingPlans: [
    {
      title: 'Dubai Delight Family Tour',
      duration: '4 Nights / 5 Days',
      startingPrice: '₹43,999 / person',
      description: 'Burj Khalifa ticket, Desert Safari with BBQ dinner & Tanoura dance, Dhow cruise dinner, and Dubai city tour.',
      inclusions: ['4-star hotel in central Dubai', 'UAE tourist visa & insurance', 'Private airport transfers', 'Daily buffet breakfast'],
    },
    {
      title: 'Thailand Bangkok & Phuket',
      duration: '5 Nights / 6 Days',
      startingPrice: '₹34,999 / person',
      description: 'Phi Phi island speedboat tour, Bangkok grand temple tour, and Chao Phraya dinner cruise.',
      inclusions: ['Hotels in Phuket & Bangkok', 'Inter-city transfers', 'Speedboat island tour with lunch', 'Daily breakfast'],
    },
    {
      title: 'Bali Tropical Honeymoon',
      duration: '5 Nights / 6 Days',
      startingPrice: '₹39,999 / person',
      description: 'Ubud rice terraces, Bali giant swing, Kintamani volcano, Tanah Lot temple, and private pool villa stay.',
      inclusions: ['Private pool villa in Seminyak/Ubud', 'Candlelight dinner & flower bath', 'Private cab for all tours', 'Daily breakfast'],
    },
  ],
  faqs: [
    {
      question: 'Do you provide UAE / Dubai tourist visas from Sikar?',
      answer:
        'Yes, we provide express 30-day and 60-day UAE tourist visas from Sikar. Processing typically takes only 2 to 3 working days with basic documents (passport front/back scan and passport-size photo).',
    },
    {
      question: 'Which airport do international flights depart from?',
      answer:
        'Direct flights to Dubai, Sharjah, and Bangkok are available from Jaipur International Airport (JAI), just 2 hours from Sikar. For other worldwide destinations, we provide seamless cab transfers to Delhi IGI Airport (DEL).',
    },
    {
      question: 'Are vegetarian and Jain food options available abroad?',
      answer:
        'Yes. In destinations like Dubai, Singapore, Bali, and Bangkok, high-quality Indian vegetarian and Jain restaurants are widely available. We book hotels located within walking distance of Indian dining establishments.',
    },
  ],
  relatedServices: [
    { title: 'Visa Assistance in Sikar', href: '/visa-assistance' },
    { title: 'Flight Booking in Sikar', href: '/flight-booking' },
    { title: 'Hotel Booking in Sikar', href: '/hotel-booking' },
    { title: 'Tour Packages from Sikar', href: '/tour-packages' },
  ],
  relatedGuides: [
    { title: 'Dubai Trip Cost from India', href: '/travel-guides/dubai-trip-cost-from-india', excerpt: 'Budget breakdown for flights, visas, hotels, and sightseeing.' },
  ],
}

export default function InternationalTourPackagesPage() {
  return <ServicePageTemplate {...pageData} />
}
