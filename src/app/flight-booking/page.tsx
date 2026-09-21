import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { serviceImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'Flight Booking in Sikar | Domestic & International Air Tickets — Sunsky Tourism',
  description:
    'Best flight booking service in Sikar, Rajasthan. Domestic & international flight ticketing across all major airlines, best fare deals, group bookings, and date change assistance.',
  alternates: { canonical: '/flight-booking' },
  openGraph: {
    title: 'Flight Booking in Sikar | Air Tickets — Sunsky Tourism',
    description:
      'Book cheap domestic & international flights in Sikar. IndiGo, Air India, Emirates, SpiceJet with date change and cancellation assistance.',
    url: 'https://www.sunskytourism.in/flight-booking',
    siteName: 'Sunsky Tourism',
    images: [{ url: serviceImages.flights, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Fast Air Ticketing',
  h1: 'Flight Booking in Sikar — Domestic & International Air Tickets',
  heroSubtitle:
    'Get the best available airfares on all domestic and international airlines. Fast booking, seat selection, extra baggage assistance, and dedicated cancellation/rescheduling support right here in Sikar.',
  heroImage: serviceImages.flights,
  canonicalUrl: '/flight-booking',
  serviceName: 'Flight Booking',
  serviceDescription:
    'Reliable flight booking service in Sikar, Rajasthan offering domestic and international airline tickets, corporate travel fares, group bookings, and 24/7 rescheduling support.',
  directAnswer: {
    question: 'How to book flights in Sikar with Sunsky Tourism?',
    answer:
      'You can book flights through Sunsky Tourism in Sikar simply by calling +91 94620 18302 or messaging on WhatsApp with your travel dates, departure city, and destination. We compare live fares across all commercial airlines (IndiGo, Air India, Emirates, Etihad, Vistara, SpiceJet, etc.) to get you the lowest available price.',
    details:
      'Unlike online portals that hit you with surprise convenience fees at the final checkout screen, Sunsky Tourism gives you transparent all-inclusive fares and personal human assistance if your flight is rescheduled or cancelled.',
  },
  overviewParagraphs: [
    'Online flight booking portals often look cheap until the final payment step, where convenience fees, seat charges, and hidden insurance inflate the final cost. Moreover, when a flight gets delayed or cancelled, getting through to an automated call center can take hours.',
    'At Sunsky Tourism, we provide local Sikar travelers with stress-free flight ticketing. We handle everything from web check-in, seat assignment, and meal bookings to senior citizen discounts and student baggage allowances.',
    'Whether you need a domestic flight from Jaipur to Mumbai, Bangalore, or Srinagar, or an international ticket to Dubai, London, Toronto, or Singapore, we ensure you travel smoothly.',
  ],
  features: [
    {
      title: 'Real-Time Airline Fare Comparison',
      description: 'We check all GDS airline inventories and low-cost carriers simultaneously to secure the best flight schedule and lowest ticket rate.',
    },
    {
      title: 'Human Support for Rescheduling',
      description: 'Need to change your travel date or cancel a ticket? We handle airline modifications directly without you waiting in automated queues.',
    },
    {
      title: 'Group & Corporate Booking Discounts',
      description: 'Traveling with 10+ passengers for a wedding, family reunion, or business trip? Enjoy special discounted group airfares.',
    },
    {
      title: 'Web Check-in & Boarding Passes',
      description: 'We handle your airline web check-in, select your preferred window/aisle seats, and send digital boarding passes straight to your WhatsApp.',
    },
  ],
  pricingPlans: [
    {
      title: 'Domestic Air Tickets',
      duration: 'Anytime Flights',
      startingPrice: 'Best Live Airline Rates',
      description: 'Flights from Jaipur (JAI) or Delhi (DEL) to Mumbai, Bengaluru, Goa, Srinagar, Kolkata, Hyderabad, and Chennai.',
      inclusions: ['Live fare search across all carriers', 'Zero hidden markup', 'Free web check-in assistance', 'Direct date change coordination'],
    },
    {
      title: 'International Flights (Middle East / Asia)',
      duration: 'Direct & Connecting',
      startingPrice: 'Special Overseas Fares',
      description: 'Direct and connecting flights to Dubai, Sharjah, Bangkok, Singapore, Kuala Lumpur, and Muscat.',
      inclusions: ['Baggage allowance verification (25-30 kg)', 'Transit visa guidance if needed', 'Meal & seat preference booking', 'WhatsApp flight status tracking'],
    },
    {
      title: 'Long-Haul International (US / UK / Europe)',
      duration: 'World Destinations',
      startingPrice: 'Competitive Global Fares',
      description: 'Flights to London, New York, Toronto, Frankfurt, Sydney, and European hubs with top international airlines.',
      inclusions: ['Student extra baggage allowance help', 'Multi-city & round-trip discounts', 'Travel insurance bundle options', 'Emergency support'],
    },
  ],
  faqs: [
    {
      question: 'Which is the nearest airport to Sikar for flight travel?',
      answer:
        'The nearest airport to Sikar is Jaipur International Airport (JAI), located approximately 120 km (around 2 to 2.5 hours via the Jaipur-Bikaner highway). We arrange private taxi transfers directly from your home in Sikar to Jaipur Airport.',
    },
    {
      question: 'What documents are required to book a flight ticket?',
      answer:
        'For domestic flights within India, only the traveler full name as per their government photo ID (Aadhaar Card, Voter ID, or Passport) is required. For international flights, a clear passport copy valid for at least 6 months is needed.',
    },
    {
      question: 'How do I receive my flight tickets?',
      answer:
        'Once booked, your confirmed e-tickets and PNR details are delivered immediately via WhatsApp and email, along with invoice receipts.',
    },
    {
      question: 'Can you help with flight cancellations and refunds?',
      answer:
        'Yes. If your plans change, contact us directly. We initiate the cancellation with the airline according to fare rules and ensure your refund is credited promptly to your account.',
    },
  ],
  relatedServices: [
    { title: 'Hotel Booking in Sikar', href: '/hotel-booking' },
    { title: 'Visa Assistance in Sikar', href: '/visa-assistance' },
    { title: 'Airport Taxi from Sikar', href: '/transportation' },
    { title: 'All Tour Packages', href: '/tour-packages' },
  ],
  relatedGuides: [
    { title: 'Dubai Trip Cost from India', href: '/travel-guides/dubai-trip-cost-from-india', excerpt: 'Flight fares and vacation budgeting guide.' },
  ],
}

export default function FlightBookingPage() {
  return <ServicePageTemplate {...pageData} />
}
