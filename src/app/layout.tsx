import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/layout/SiteChrome'
import MotionProvider from '@/components/layout/MotionProvider'
import ScrollProgress from '@/components/ui/ScrollProgress'
import PageTransition from '@/components/layout/PageTransition'
import AnalyticsTracker from '@/components/analytics/Tracker'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import JsonLd from '@/components/seo/JsonLd'
import WarningSuppressor from '@/components/WarningSuppressor'
import { getSettings } from '@/lib/settings'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = s.seo?.defaultTitle || 'Sunsky Tourism | Travel Agency & Tour Packages in Sikar'
  const desc =
    s.seo?.defaultDescription ||
    'Sunsky Tourism is the premier travel agency in Sikar, Rajasthan. Curated Rajasthan tour packages, domestic & international holidays, flight booking, hotels, and visa assistance.'
  const brand = s.business?.brand || 'Sunsky Tourism'
  return {
    title: { default: title, template: `%s | ${brand}` },
    description: desc,
    keywords: [
      'Travel Agency in Sikar',
      'Tour and Travel Agency in Sikar',
      'Tour Packages from Sikar',
      'Rajasthan Tour Packages',
      'India Tour Packages',
      'International Tour Packages',
      'Flight Booking in Sikar',
      'Hotel Booking in Sikar',
      'Holiday Packages',
      'Visa Assistance in Sikar',
      'Rajasthan Travel Agency',
      'Sunsky Tourism',
      'Shekhawati Tourism',
    ],
    metadataBase: new URL('https://www.sunskytourism.in'),
    alternates: { canonical: '/' },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: 'https://www.sunskytourism.in',
      siteName: brand,
      locale: 'en_IN',
      images: [{ url: 'https://www.sunskytourism.in/images/hero.jpg', width: 1373, height: 772, alt: `${brand} — Travel Agency & Tour Packages in Sikar` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: ['https://www.sunskytourism.in/images/hero.jpg'],
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070707',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const s = await getSettings()
  const b = s.business
  const seo = s.seo
  const brand = b?.brand || 'Sunsky Tourism'
  const desc =
    seo?.defaultDescription ||
    'Sunsky Tourism is the premier travel agency in Sikar, Rajasthan offering curated Rajasthan tours, India holidays, international packages, flights, hotels, and visa services.'

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': 'https://www.sunskytourism.in/#travelagency',
    name: brand,
    legalName: 'Sunsky Tourism',
    url: 'https://www.sunskytourism.in',
    logo: 'https://www.sunskytourism.in/images/logo.png',
    image: 'https://www.sunskytourism.in/images/hero.jpg',
    description: desc,
    telephone: b?.phoneLinks?.[0] ?? '+919462018302',
    email: b?.email || 'sunskytourism.in@gmail.com',
    founder: {
      '@type': 'Person',
      name: 'Dharmpal Bagotiya',
      jobTitle: 'Proprietor',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: b?.address || 'W.No. 45, Industrial Area, Sikar',
      addressLocality: 'Sikar',
      addressRegion: 'Rajasthan',
      postalCode: '332001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: b?.latitude || '27.6094',
      longitude: b?.longitude || '75.1399',
    },
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
    priceRange: '₹₹',
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Sikar' },
      { '@type': 'AdministrativeArea', name: 'Rajasthan' },
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Sunsky Tourism Travel Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Tour Packages',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rajasthan Tour Packages' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'India Tour Packages' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'International Tour Packages' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Travel Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Flight Booking Service in Sikar' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hotel & Resort Booking in Sikar' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Visa Assistance Service in Sikar' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sightseeing & Airport Taxi Service in Sikar' } },
          ],
        },
      ],
    },
    sameAs: [
      'https://www.facebook.com/sunskytourism',
      'https://www.instagram.com/sunskytourism',
      'https://www.youtube.com/@sunskytourism',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.sunskytourism.in/#website',
    name: brand,
    url: 'https://www.sunskytourism.in',
    description: desc,
    publisher: {
      '@id': 'https://www.sunskytourism.in/#travelagency',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.sunskytourism.in/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.sunskytourism.in" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-[#070707] text-slate-100 antialiased`}>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <MotionProvider>
          <AnalyticsTracker />
          <GoogleAnalytics />
          <WarningSuppressor />
          <ScrollProgress />
          <SiteChrome>
            <PageTransition>{children}</PageTransition>
          </SiteChrome>
        </MotionProvider>
      </body>
    </html>
  )
}
