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
import WarningSuppressor from '@/components/WarningSuppressor'
import { getSettings } from '@/lib/settings'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = s.seo?.defaultTitle || 'Sunsky Tourism — Explore More. Worry Less.'
  const desc = s.seo?.defaultDescription || 'Travel made easy, memories made forever.'
  const brand = s.business?.brand || 'Sunsky Tourism'
  return {
    title: { default: title, template: `%s | ${brand}` },
    description: desc,
    keywords: ['Sunsky Tourism', 'travel agency', 'tour packages', 'holiday packages', 'flight booking', 'hotel booking', 'visa assistance'],
    metadataBase: new URL('https://www.sunskytourism.in'),
    alternates: { canonical: '/' },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: 'https://www.sunskytourism.in',
      siteName: brand,
      locale: 'en_IN',
      images: [{ url: 'https://www.sunskytourism.in/images/hero.jpg', width: 1373, height: 772, alt: `${brand} — premium travel experiences` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: ['https://www.sunskytourism.in/images/hero.jpg'],
    },
    other: {
      'google-site-verification': '',
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
  const desc = seo?.defaultDescription || 'Travel made easy, memories made forever.'

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: brand,
    url: 'https://www.sunskytourism.in',
    logo: 'https://www.sunskytourism.in/images/logo.png',
    image: 'https://www.sunskytourism.in/images/hero.jpg',
    description: desc,
    telephone: b?.phoneLinks?.[0] ?? '+919462018302',
    email: b?.email || 'sunskytourism.in@gmail.com',
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
    areaServed: ['IN', 'AE'],
    priceRange: '₹₹',
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
    name: brand,
    url: 'https://www.sunskytourism.in',
    description: desc,
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
        <meta name="theme-color" content="#f97316" />
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