import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/layout/SiteChrome'
import MotionProvider from '@/components/layout/MotionProvider'
import ScrollProgress from '@/components/ui/ScrollProgress'
import PageTransition from '@/components/layout/PageTransition'
import AnalyticsTracker from '@/components/analytics/Tracker'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import JsonLd from '@/components/seo/JsonLd'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Sunsky Tourism — Explore More. Worry Less.',
    template: '%s | Sunsky Tourism',
  },
  description:
    'Sunsky Tourism — travel made easy, memories made forever. Tour packages, flights, hotels, holiday plans and visa assistance from Sikar, Rajasthan. Explore Rajasthan, Kashmir, Goa, Dubai and more.',
  keywords: [
    'Sunsky Tourism',
    'travel agency Sikar',
    'tour packages Rajasthan',
    'holiday packages',
    'flight booking',
    'hotel booking',
    'visa assistance',
    'Kashmir tour',
    'Goa tour',
    'Dubai tour',
  ],
  metadataBase: new URL('https://www.sunskytourism.in'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sunsky Tourism — Explore More. Worry Less.',
    description:
      'Travel made easy, memories made forever. Premium tour packages, flights, hotels and visa assistance.',
    type: 'website',
    url: 'https://www.sunskytourism.in',
    siteName: 'Sunsky Tourism',
    locale: 'en_IN',
    images: [
      {
        url: 'https://www.sunskytourism.in/images/hero.jpg',
        width: 1373,
        height: 772,
        alt: 'Sunsky Tourism — premium travel experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunsky Tourism — Explore More. Worry Less.',
    description:
      'Premium tour packages, flights, hotels and visa assistance from Sikar, Rajasthan.',
    images: ['https://www.sunskytourism.in/images/hero.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070707',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Sunsky Tourism',
  url: 'https://www.sunskytourism.in',
  logo: 'https://www.sunskytourism.in/images/logo.png',
  image: 'https://www.sunskytourism.in/images/hero.jpg',
  description:
    'Travel agency in Sikar, Rajasthan — tour packages, flights, hotels, holiday plans and visa assistance.',
  telephone: '+91-94620-18302',
  email: 'sunskytourism.in@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'W.No. 45, Industrial Area',
    addressLocality: 'Sikar',
    addressRegion: 'Rajasthan',
    postalCode: '332001',
    addressCountry: 'IN',
  },
  areaServed: ['IN', 'AE'],
  priceRange: '₹₹',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sunsky Tourism',
  url: 'https://www.sunskytourism.in',
  description:
    'Tour packages, flights, hotels, holiday plans and visa assistance from Sikar, Rajasthan.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.sunskytourism.in/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#070707] text-slate-100 antialiased`}>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <MotionProvider>
          <AnalyticsTracker />
          <GoogleAnalytics />
          <ScrollProgress />
          <SiteChrome>
            <PageTransition>{children}</PageTransition>
          </SiteChrome>
        </MotionProvider>
      </body>
    </html>
  )
}