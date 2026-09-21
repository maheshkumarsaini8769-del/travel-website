import type { Metadata } from 'next'
import ServicePageTemplate, { ServicePageProps } from '@/components/services/ServicePageTemplate'
import { serviceImages } from '@/data/images'

export const metadata: Metadata = {
  title: 'Visa Assistance in Sikar | Tourist Visas for Dubai, Schengen, UK, Singapore — Sunsky Tourism',
  description:
    'Reliable tourist visa assistance in Sikar, Rajasthan with Sunsky Tourism. Fast visa processing for UAE Dubai, Schengen, UK, US, Singapore, Thailand, and Malaysia with document verification.',
  alternates: { canonical: '/visa-assistance' },
  openGraph: {
    title: 'Visa Assistance in Sikar | Tourist Visas — Sunsky Tourism',
    description:
      'Tourist visa assistance in Sikar. UAE Dubai, Schengen Europe, UK, Singapore, Thailand visas with expert document checking and appointment support.',
    url: 'https://www.sunskytourism.in/visa-assistance',
    siteName: 'Sunsky Tourism',
    images: [{ url: serviceImages.visa, width: 1200, height: 630 }],
  },
}

const pageData: ServicePageProps = {
  eyebrow: 'Accurate Visa Processing',
  h1: 'Visa Assistance in Sikar — Tourist Visas, Documentation & Application Support',
  heroSubtitle:
    'Navigating international visa requirements does not have to be stressful. Sunsky Tourism provides expert visa consultation, rigorous document checks, and end-to-end filing support right here in Sikar, Rajasthan.',
  heroImage: serviceImages.visa,
  canonicalUrl: '/visa-assistance',
  serviceName: 'Visa Assistance',
  serviceDescription:
    'Professional tourist visa assistance in Sikar, Rajasthan covering Dubai/UAE, Schengen countries, the UK, Singapore, Thailand, Malaysia, and worldwide destinations.',
  directAnswer: {
    question: 'How does visa assistance work with Sunsky Tourism in Sikar?',
    answer:
      'Sunsky Tourism provides step-by-step tourist visa guidance from Sikar. We review your travel itinerary, verify your passport and financial paperwork against embassy guidelines, fill out official visa application forms, book biometric appointments (for VFS / embassy centers), and track your visa status until approved.',
    details:
      'We specialize in express UAE (Dubai) 30-day and 60-day tourist visas (processed in 48-72 hours), e-visas for Southeast Asia (Thailand, Singapore, Malaysia, Vietnam), and comprehensive documentation review for Schengen, UK, and US visitor visas.',
  },
  overviewParagraphs: [
    'Visa rejections are often caused by minor paperwork mistakes: mismatched names, incorrect photograph specifications, vague cover letters, or incomplete financial proof. Once a visa is refused, subsequent applications face stricter scrutiny.',
    'At Sunsky Tourism in Sikar, we have helped hundreds of families, honeymooners, and solo travelers secure their international tourist visas. Our visa consultants stay up to date on evolving consulate regulations and paperwork requirements.',
    'Whether you are visiting family in Dubai, taking your children to Disneyland, or embarking on a European holiday, we ensure your application file is thorough, accurate, and submitted without delay.',
  ],
  features: [
    {
      title: 'Detailed Document Checklist',
      description: 'We give you a customized checklist tailored to your employment, business, or sponsorship profile, avoiding common embassy objections.',
    },
    {
      title: 'Form Filling & Cover Letters',
      description: 'Our team fills out detailed online visa portals and drafts professional day-by-day travel cover letters and flight itinerary reserves.',
    },
    {
      title: 'VFS Appointment Booking',
      description: 'We help you secure earliest biometric and submission appointments at VFS Global centers in Jaipur or New Delhi.',
    },
    {
      title: 'Express Dubai / UAE Processing',
      description: 'Direct electronic visa processing for UAE 30-day and 60-day tourist visas with fast 48–72 hour turnaround times.',
    },
  ],
  pricingPlans: [
    {
      title: 'Dubai / UAE Tourist Visa',
      duration: '30 or 60 Days Single Entry',
      startingPrice: 'Starting from ₹6,999',
      description: 'Quick electronic visa processing for holidaymakers and family visitors to Dubai, Abu Dhabi, and Sharjah.',
      inclusions: ['Official UAE visa processing fee', 'Mandatory COVID/travel medical insurance', 'Express 48–72 hour delivery', 'WhatsApp PDF delivery'],
    },
    {
      title: 'Southeast Asia E-Visas (Thailand / Malaysia)',
      duration: 'Tourist E-Visa',
      startingPrice: 'Starting from ₹3,499',
      description: 'Streamlined online visa and digital arrival card processing for Thailand, Singapore, Malaysia, and Vietnam.',
      inclusions: ['Form filling & photograph resizing', 'Document validity check', 'Embassy fee remittance', 'Digital approval certificate'],
    },
    {
      title: 'Schengen & UK Visa Consultation',
      duration: 'Standard Tourist Entry',
      startingPrice: 'Consultation & File Preparation',
      description: 'End-to-end file preparation for France, Switzerland, Germany, Italy, or UK visitor visas.',
      inclusions: ['Complete document audit', 'VFS appointment scheduling', 'Day-by-day itinerary drafting', 'Confirmed hotel/flight voucher proof'],
    },
  ],
  faqs: [
    {
      question: 'What basic documents do I need for a Dubai tourist visa?',
      answer:
        'For an ordinary UAE/Dubai tourist visa, all you need is: 1) A clear colored scan of your passport front and back (valid for at least 6 months), 2) A recent passport-size color photograph with white background, and 3) Basic contact information. No bank statements are required for Dubai tourist visas.',
    },
    {
      question: 'Where do I go for Schengen or UK biometric appointments from Sikar?',
      answer:
        'Biometrics for Schengen countries and the UK are submitted in person at VFS Global application centers in Jaipur (closest, 2 hours from Sikar) or New Delhi. We prepare your complete folder and book the earliest available appointment slot.',
    },
    {
      question: 'Do you guarantee visa approval?',
      answer:
        'No ethical agency can guarantee visa approval, as the sovereign decision rests solely with the consulate or embassy officer. However, our meticulous file preparation and document verification minimizes paperwork errors and substantially elevates your probability of approval.',
    },
  ],
  relatedServices: [
    { title: 'International Tour Packages', href: '/international-tour-packages' },
    { title: 'Flight Booking in Sikar', href: '/flight-booking' },
    { title: 'Hotel Booking in Sikar', href: '/hotel-booking' },
    { title: 'Tour Packages from Sikar', href: '/tour-packages' },
  ],
  relatedGuides: [
    { title: 'Dubai Trip Cost from India', href: '/travel-guides/dubai-trip-cost-from-india', excerpt: 'Visa, flights, and sightseeing cost guide for Dubai.' },
  ],
}

export default function VisaAssistancePage() {
  return <ServicePageTemplate {...pageData} />
}
