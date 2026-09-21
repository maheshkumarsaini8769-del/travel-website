import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { destinationImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'India Tour Packages | Kashmir, Goa, Himachal Holidays — Sunsky Tourism Sikar',
  description:
    'Explore India tour packages with Sunsky Tourism in Sikar. Personalized family and honeymoon vacations to Kashmir, Goa, Himachal Pradesh, Kerala, and the Golden Triangle.',
  alternates: { canonical: '/india-tour-packages' },
  openGraph: {
    title: 'India Tour Packages | Sunsky Tourism Sikar',
    description:
      'Curated India holiday packages departing from Sikar/Jaipur. Kashmir, Goa, Himachal, Kerala, and Golden Triangle tours with flights and hotels.',
    url: 'https://www.sunskytourism.in/india-tour-packages',
    siteName: 'Sunsky Tourism',
    images: [{ url: destinationImages.kashmir, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Incredible India Vacations',
  h1: 'India Tour Packages from Sikar & All-Inclusive Domestic Holidays',
  heroSubtitle:
    'From the snow-capped Himalayan peaks of Kashmir and Himachal to the sun-soaked palm beaches of Goa and the backwaters of Kerala — explore India with trusted local planning.',
  heroImage: destinationImages.kashmir,
  canonicalUrl: '/india-tour-packages',
  serviceName: 'India Tour Packages',
  serviceDescription:
    'Complete domestic India tour packages organized from Sikar, Rajasthan including flights, premium hotels, private transport, and local sightseeing.',
  directAnswer: {
    question: 'What India tour packages does Sunsky Tourism offer from Sikar?',
    answer:
      'Sunsky Tourism offers all-inclusive domestic tour packages covering Kashmir (Srinagar, Gulmarg, Pahalgam), Goa beaches, Himachal Pradesh (Manali, Shimla, Dharamshala), Kerala (Munnar, Alleppey), Uttarakhand, and the Golden Triangle. We arrange flight tickets, airport cabs, verified stays, and customized itineraries.',
    details:
      'We handle all details from Sikar doorstep taxi pickups to flight check-ins, gondola bookings in Gulmarg, houseboat stays in Srinagar or Alleppey, and family-friendly dining recommendations.',
  },
  overviewParagraphs: [
    'India is a land of endless geographical wonder. You can wake up to misty pine forests in the Himalayas, relax on tropical coconut-fringed beaches by afternoon, or sail on tranquil emerald backwaters at sunset.',
    'Planning a long-distance vacation within India can be overwhelming when managing flight schedules, reliable local drivers, and honest hotel ratings. That is where Sunsky Tourism steps in.',
    'Our domestic holiday packages are crafted to maximize your leisure time. We eliminate logistical stress so your family can immerse themselves in the sights, cuisines, and cultural treasures of each destination.',
  ],
  features: [
    {
      title: 'Flight + Cab Bundles',
      description: 'We connect Sikar to your dream destination with seamless cab transfers to Jaipur or Delhi airports and confirmed flight tickets.',
    },
    {
      title: 'Signature Stays & Houseboats',
      description: 'Stay in authentic Dal Lake houseboats, beachfront Goa boutique resorts, or pine-view Himalayan wooden chalets.',
    },
    {
      title: 'Advance Activity Bookings',
      description: 'Skip long queues with pre-booked Gulmarg gondola tickets, Scuba diving in Goa, and Shikara boat rides.',
    },
    {
      title: 'Honeymoon & Family Specials',
      description: 'Special inclusions such as floral room decoration, candlelight dinners, cake, and personalized sightseeing schedules.',
    },
  ],
  pricingPlans: [
    {
      title: 'Kashmir Scenic Paradise',
      duration: '5 Nights / 6 Days',
      startingPrice: '₹21,999 / person',
      description: 'Srinagar, Gulmarg snow point, Pahalgam Betaab Valley, and luxury Dal Lake houseboat.',
      inclusions: ['Srinagar airport transfers', 'Dal Lake Shikara ride', 'Deluxe hotels & 1-night houseboat', 'Breakfast and dinner included'],
    },
    {
      title: 'Goa Coastal Getaway',
      duration: '4 Nights / 5 Days',
      startingPrice: '₹13,499 / person',
      description: 'North and South Goa beaches, historic Portuguese churches, spice plantations, and Mandovi river cruise.',
      inclusions: ['Airport / Railway station transfers', 'Resort stay with swimming pool', 'Full-day North & South Goa sightseeing', 'Daily buffet breakfast'],
    },
    {
      title: 'Himachal Manali & Shimla Escape',
      duration: '5 Nights / 6 Days',
      startingPrice: '₹16,499 / person',
      description: 'Shimla Mall Road, Kufri snow peak, Solang Valley adventure, and scenic Rohtang Pass.',
      inclusions: ['Private AC cab throughout', '3-star mountain view hotels', 'All tolls, state taxes, and parking', 'Daily breakfast and dinner'],
    },
  ],
  faqs: [
    {
      question: 'How do I reach my destination from Sikar?',
      answer:
        'For distant states like Kashmir, Goa, or Kerala, we arrange private cab transport from Sikar to Jaipur International Airport (2 hours drive) or Delhi IGI Airport, followed by confirmed direct flights to Srinagar, Goa (GOI/GOX), or Kochi.',
    },
    {
      question: 'Are meals included in domestic holiday packages?',
      answer:
        'Yes, most of our holiday packages include daily breakfast (CP plan), and hill station packages (like Kashmir and Himachal) typically include both breakfast and dinner (MAP plan) for complete comfort.',
    },
    {
      question: 'Can you arrange senior-citizen friendly domestic tours?',
      answer:
        'Yes. We specialize in relaxed-pace itineraries with minimal climbing, private ground-floor or elevator-accessible rooms, and vehicles that stay close to monuments and sightseeing points.',
    },
  ],
  relatedServices: [
    { title: 'Rajasthan Tour Packages', href: '/rajasthan-tour-packages' },
    { title: 'International Tour Packages', href: '/international-tour-packages' },
    { title: 'Flight Booking in Sikar', href: '/flight-booking' },
    { title: 'Hotel Booking in Sikar', href: '/hotel-booking' },
  ],
  relatedGuides: [
    { title: 'Kashmir Trip Planning Guide', href: '/travel-guides/kashmir-trip-planning-guide', excerpt: 'First-timer tips for Srinagar, Gulmarg, and Pahalgam.' },
    { title: 'Best Places to Visit in Rajasthan', href: '/travel-guides/best-places-to-visit-in-rajasthan', excerpt: 'Comprehensive Rajasthan travel ideas.' },
  ],
}

export default function IndiaTourPackagesPage() {
  return <ServicePageTemplate {...pageData} />
}
