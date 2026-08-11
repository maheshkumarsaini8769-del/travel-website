import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/layout/SiteChrome'
import MotionProvider from '@/components/layout/MotionProvider'
import ScrollProgress from '@/components/ui/ScrollProgress'
import PageTransition from '@/components/layout/PageTransition'

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
  openGraph: {
    title: 'Sunsky Tourism — Explore More. Worry Less.',
    description:
      'Travel made easy, memories made forever. Premium tour packages, flights, hotels and visa assistance.',
    type: 'website',
    siteName: 'Sunsky Tourism',
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
        <MotionProvider>
          <ScrollProgress />
          <SiteChrome>
            <PageTransition>{children}</PageTransition>
          </SiteChrome>
        </MotionProvider>
      </body>
    </html>
  )
}
