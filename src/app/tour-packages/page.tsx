import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { serviceImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'Tour Packages from Sikar | Customized Holiday Packages — Sunsky Tourism',
  description:
    'Explore curated tour packages from Sikar with Sunsky Tourism. Rajasthan heritage tours, India holiday trips, and international vacation packages at transparent rates. Plan today!',
  alternates: { canonical: '/tour-packages' },
  openGraph: {
    title: 'Tour Packages from Sikar | Holiday Packages — Sunsky Tourism',
    description:
      'Curated holiday and tour packages from Sikar. Handpicked hotels, sanitized private cabs, sightseeing, and 24/7 on-tour support.',
    url: 'https://www.sunskytourism.in/tour-packages',
    siteName: 'Sunsky Tourism',
    images: [{ url: serviceImages.tours, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Curated Travel Experiences',
  h1: 'Tour Packages from Sikar & Customized Holiday Plans',
  heroSubtitle:
    'Experience worry-free holidays planned by local experts in Sikar. Private transportation, verified hotels, custom itineraries, and round-the-clock trip coordination.',
  heroImage: serviceImages.tours,
  canonicalUrl: '/tour-packages',
  serviceName: 'Tour Packages',
  serviceDescription:
    'Comprehensive domestic and international tour packages departing from Sikar with personalized itineraries, verified hotel accommodations, and private cab services.',
  directAnswer: {
    question: 'How do tour packages from Sikar work with Sunsky Tourism?',
    answer:
      'Sunsky Tourism provides end-to-end holiday planning from Sikar, Rajasthan. We customize your itinerary, arrange doorstep cab pickups from Sikar or airport transfers to Jaipur/Delhi, book verified 3-star to 5-star hotels, organize sightseeing permits, and provide 24/7 on-tour phone support.',
    details:
      'Whether you are planning a weekend Rajasthan road trip, a scenic family holiday in Kashmir or Himachal, a beach vacation in Goa, or an international tour to Dubai, every package includes transparent pricing with no hidden costs.',
  },
  overviewParagraphs: [
    'Traveling should be a joyous adventure, not an administrative headache. At Sunsky Tourism, based in Sikar, Rajasthan, we design every tour package around your schedule, budget, and personal interests.',
    'From the royal forts of Rajasthan to the serene houseboats of Dal Lake in Kashmir and the futuristic skyline of Dubai, our experienced holiday specialists personally coordinate each detail.',
    'All packages include private sanitized vehicles with seasoned chauffeurs, quality hotels with daily breakfast, entrance tickets, and emergency assistance. You simply pack your bags and enjoy the journey.',
  ],
  features: [
    {
      title: 'Doorstep Pickup from Sikar',
      description: 'Private vehicles pick you up directly from your home or hotel in Sikar, or arrange convenient transfers to Jaipur Airport and Railway Junction.',
    },
    {
      title: 'Handpicked Verified Stays',
      description: 'We partner only with rigorously inspected hotels, heritage havelis, and desert camps known for hygiene, family comfort, and great dining.',
    },
    {
      title: 'Transparent No-Surprise Pricing',
      description: 'Every toll, parking fee, driver allowance, hotel tax, and breakfast is itemized in your quote upfront with zero surprise expenses.',
    },
    {
      title: '24/7 Active On-Trip Support',
      description: 'Our Sikar team stays in direct touch via WhatsApp and phone throughout your vacation to handle any unexpected adjustments or requests.',
    },
  ],
  pricingPlans: [
    {
      title: 'Rajasthan Heritage Circuit',
      duration: '4 Nights / 5 Days',
      startingPrice: '₹14,999 / person',
      description: 'Jaipur, Jodhpur, and Udaipur heritage tour with private AC sedan, 3-star hotel stays, and fort sightseeing.',
      inclusions: ['Private AC vehicle throughout', 'Breakfast included daily', 'All tolls, parking & driver charges', 'Dedicated tour coordinator'],
    },
    {
      title: 'Kashmir Paradise Tour',
      duration: '5 Nights / 6 Days',
      startingPrice: '₹22,499 / person',
      description: 'Srinagar, Gulmarg gondola, Pahalgam valley, and traditional Dal Lake houseboat stay.',
      inclusions: ['Srinagar airport transfers', 'Dal Lake Shikara ride', 'Houseboat & deluxe hotel stay', 'Breakfast & dinner included'],
    },
    {
      title: 'Dubai Luxury Getaway',
      duration: '4 Nights / 5 Days',
      startingPrice: '₹44,999 / person',
      description: 'Burj Khalifa at the top, Desert Safari with BBQ dinner, Marina Dhow cruise, and Dubai city tour.',
      inclusions: ['4-star hotel in central Dubai', 'Tourist visa assistance included', 'All sightseeing transfers', 'Daily buffet breakfast'],
    },
  ],
  faqs: [
    {
      question: 'Can tour packages be customized according to my family needs?',
      answer:
        'Yes, 100% of our packages can be customized. You can alter the duration, choose your preferred hotel category (budget, 3-star, 4-star, or luxury heritage), add special experiences (like a desert camel safari or candlelit dinner), and set your own daily travel pace.',
    },
    {
      question: 'Do packages include pick-up from Sikar?',
      answer:
        'Yes. For road-based tours across Rajasthan, Delhi, Agra, or Himachal, our private cabs pick you up directly from Sikar. For flight-based tours, we provide comfortable cab transfers from Sikar to Jaipur International Airport (JAI) or Delhi IGI Airport (DEL).',
    },
    {
      question: 'What is the booking deposit policy?',
      answer:
        'We require an initial advance deposit to secure your hotel reservations and vehicle bookings, with the remainder payable prior to travel or upon arrival. We provide GST invoices and transparent payment receipts.',
    },
    {
      question: 'How far in advance should I book my holiday package?',
      answer:
        'For peak winter travel in Rajasthan (October to February) and school holidays, we recommend booking 3 to 6 weeks in advance to secure the best hotel rates and preferred room categories.',
    },
  ],
  relatedServices: [
    { title: 'Rajasthan Tour Packages', href: '/rajasthan-tour-packages' },
    { title: 'India Tour Packages', href: '/india-tour-packages' },
    { title: 'International Tour Packages', href: '/international-tour-packages' },
    { title: 'Flight Booking in Sikar', href: '/flight-booking' },
    { title: 'Hotel Booking in Sikar', href: '/hotel-booking' },
  ],
  relatedGuides: [
    { title: 'Best Places to Visit in Rajasthan', href: '/travel-guides/best-places-to-visit-in-rajasthan', excerpt: 'Comprehensive guide to Jaipur, Udaipur, Jaisalmer, and Jodhpur.' },
    { title: 'Rajasthan Trip Cost from Sikar', href: '/travel-guides/rajasthan-trip-cost-from-sikar', excerpt: 'Realistic cost estimates and budgeting for a 3-day to 7-day Rajasthan road trip.' },
  ],
}

export default function TourPackagesPage() {
  return <ServicePageTemplate {...pageData} />
}
