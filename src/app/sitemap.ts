import type { MetadataRoute } from 'next'
import { packages } from '@/data/packages'
import { guides } from '@/data/guides'
import { destinations } from '@/data/destinations'
import { hotels } from '@/data/hotels'

const base = 'https://www.sunskytourism.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/destinations`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/packages`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/hotels`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/offers`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/travel-guides`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/services`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/booking`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
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
    ...hotelRoutes,
  ]
}
