import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { destinationImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'Rajasthan Tour Packages | Best Travel Agency in Sikar — Sunsky Tourism',
  description:
    'Book authentic Rajasthan tour packages with Sunsky Tourism in Sikar. Custom trips to Jaipur, Udaipur, Jaisalmer, Jodhpur, and Shekhawati with private cars & verified stays.',
  alternates: { canonical: '/rajasthan-tour-packages' },
  openGraph: {
    title: 'Rajasthan Tour Packages | Sunsky Tourism Sikar',
    description:
      'Curated Rajasthan holidays with private AC cabs, verified heritage hotels, desert safaris, and local guides.',
    url: 'https://www.sunskytourism.in/rajasthan-tour-packages',
    siteName: 'Sunsky Tourism',
    images: [{ url: destinationImages.jaisalmer, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Land of Kings',
  h1: 'Rajasthan Tour Packages from Sikar & Heritage Road Trips',
  heroSubtitle:
    'Discover majestic forts, golden desert dunes, tranquil lakes, and royal palaces. Customized road tours with sanitized vehicles, expert chauffeurs, and handpicked heritage stays.',
  heroImage: destinationImages.jaisalmer,
  canonicalUrl: '/rajasthan-tour-packages',
  serviceName: 'Rajasthan Tour Packages',
  serviceDescription:
    'Specialized Rajasthan tour packages departing from Sikar covering Jaipur, Udaipur, Jaisalmer, Jodhpur, Bikaner, Mount Abu, and Shekhawati.',
  directAnswer: {
    question: 'Why choose Sunsky Tourism for Rajasthan tour packages in Sikar?',
    answer:
      'Being based in Sikar, Rajasthan, Sunsky Tourism possesses unmatched local ground knowledge of Rajasthan routes, road conditions, heritage hotels, and desert camps. We deliver genuine royal hospitality with private sanitized AC cars, verified havelis, camel safaris, and transparent pricing without middleman markups.',
    details:
      'Whether you want a quick weekend getaway to Jaipur and Nahargarh, a 5-day desert safari in Jaisalmer and Jodhpur, or a comprehensive 9-day royal circuit across all princely states, we build your trip exactly the way you want it.',
  },
  overviewParagraphs: [
    'Rajasthan is a magical tapestry of towering hill forts, vibrant bazaars, colorful turbans, desert folk music, and legendary hospitality. Planning a road trip across this vast state requires careful routing to balance driving times with leisurely sightseeing.',
    'As a premier travel agency headquartered in Sikar, we manage every leg of your Rajasthan tour. Our courteous drivers understand the best local dining spots, scenic viewpoints, and authentic handicraft centers, avoiding tourist traps.',
    'From romantic sunset boat cruises on Lake Pichola in Udaipur to starry campfire nights amidst the Sam Sand Dunes in Jaisalmer, every itinerary is designed for lifelong memories.',
  ],
  features: [
    {
      title: 'Local Sikar & Shekhawati Roots',
      description: 'Headquartered in Sikar, we offer insider access to Shekhawati painted havelis, authentic Marwari cuisine, and hidden heritage gems.',
    },
    {
      title: 'Private AC Sedans & SUVs',
      description: 'Travel in modern, air-conditioned Swift Dzire, Toyota Innova, or Crysta with professional, verified highway chauffeurs.',
    },
    {
      title: 'Desert Camping & Camel Safaris',
      description: 'Enjoy premium Swiss tent stays at Sam dunes in Jaisalmer featuring Rajasthani folk dance, Kalbelia performances, and dune bashing.',
    },
    {
      title: 'Flexible Pace & Timings',
      description: 'Take your time at Mehrangarh Fort or City Palace without feeling rushed by group tour timetables.',
    },
  ],
  pricingPlans: [
    {
      title: 'Golden Triangle & Pink City',
      duration: '3 Nights / 4 Days',
      startingPrice: '₹11,499 / person',
      description: 'Jaipur, Amber Fort, Nahargarh sunset, and local craft shopping with private cab from Sikar.',
      inclusions: ['Private AC vehicle from Sikar', '3-star hotel stay with breakfast', 'Local sightseeing guidance', 'Tolls & driver charges included'],
    },
    {
      title: 'Royal Desert & Forts Tour',
      duration: '5 Nights / 6 Days',
      startingPrice: '₹18,999 / person',
      description: 'Jodhpur Mehrangarh Fort + Jaisalmer Golden Fort, Patwon Ki Haveli, and luxury Sam desert camp.',
      inclusions: ['Private AC vehicle throughout', 'Desert camp with cultural show & dinner', 'Daily breakfast at all stays', 'Camel safari experience'],
    },
    {
      title: 'Complete Royal Rajasthan Circuit',
      duration: '7 Nights / 8 Days',
      startingPrice: '₹26,999 / person',
      description: 'Jaipur, Jodhpur, Jaisalmer, and Udaipur covering lakes, forts, palaces, and desert dunes.',
      inclusions: ['Innova/Sedan for the full circuit', 'Heritage & 3/4-star hotel stays', 'Lake Pichola boat ride assistance', '24/7 dedicated support'],
    },
  ],
  faqs: [
    {
      question: 'Which is the best time to visit Rajasthan?',
      answer:
        'The ideal time to visit Rajasthan is between October and March. During these months, the daytime weather is pleasantly sunny (20°C to 28°C) and nights are crisp, making fort exploration and desert safaris extremely enjoyable.',
    },
    {
      question: 'Can you organize a tour starting directly from Sikar?',
      answer:
        'Yes, absolutely. Our private cabs pick you up directly from your doorstep in Sikar, or from Sikar Railway Station, and drop you back at the conclusion of the tour.',
    },
    {
      question: 'What is included in the desert camp stay in Jaisalmer?',
      answer:
        'Our Jaisalmer desert package includes pickup from Jaisalmer, a camel safari at the dunes for sunset, check-in to a luxury Swiss tent at Sam dunes, evening high tea with snacks, a live Rajasthani folk music and Kalbelia dance show around a bonfire, a traditional buffet dinner, and breakfast the next morning.',
    },
    {
      question: 'Is Rajasthan safe for family trips and solo women travellers?',
      answer:
        'Rajasthan is historically known for its welcoming hospitality (Atithi Devo Bhava) and is one of the safest tourist destinations in India. Our drivers are police-verified, courteous, and seasoned on all tourist routes.',
    },
  ],
  relatedServices: [
    { title: 'All Tour Packages', href: '/tour-packages' },
    { title: 'India Tour Packages', href: '/india-tour-packages' },
    { title: 'Taxi Service in Sikar', href: '/transportation' },
    { title: 'Hotel Booking in Sikar', href: '/hotel-booking' },
  ],
  relatedGuides: [
    { title: 'Best Places to Visit in Rajasthan', href: '/travel-guides/best-places-to-visit-in-rajasthan', excerpt: 'Comprehensive guide to Rajasthan top royal cities and forts.' },
    { title: 'Jaipur 3-Day Travel Itinerary', href: '/travel-guides/jaipur-3-day-travel-itinerary', excerpt: 'Detailed hour-by-hour itinerary for exploring the Pink City.' },
    { title: 'Jaisalmer Trip Guide', href: '/travel-guides/jaisalmer-trip-guide', excerpt: 'Insider guide to desert camping, camel safaris, and living fort walks.' },
  ],
}

export default function RajasthanTourPackagesPage() {
  return <ServicePageTemplate {...pageData} />
}
