import type { MetadataRoute } from 'next'
import { getPackages } from '@/lib/data'
import { guides } from '@/data/guides'
import { destinations } from '@/data/destinations'
import { hotels } from '@/data/hotels'
import { tours } from '@/data/tours'

const base = 'https://www.sunskytourism.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packages = await getPackages()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/destinations`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/packages`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tours`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hotels`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/offers`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/travel-guides`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/services`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/booking`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/plan-your-trip`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/feedback`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/reviews`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/search`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cancellation-policy`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const packageRoutes = packages.map((p) => ({
    url: `${base}/packages/${p.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const destinationRoutes = destinations.map((d) => ({
    url: `${base}/destinations/${d.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const guideRoutes = guides.map((g) => ({
    url: `${base}/travel-guides/${g.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const tourRoutes = tours.map((t) => ({
    url: `${base}/tours/${t.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const hotelRoutes = hotels.map((h) => ({
    url: `${base}/hotels#${h.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...packageRoutes,
    ...destinationRoutes,
    ...guideRoutes,
    ...tourRoutes,
    ...hotelRoutes,
  ]
}