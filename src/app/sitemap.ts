import type { MetadataRoute } from 'next'
import { getPackages, getDestinations } from '@/lib/data'
import { guides } from '@/data/guides'
import { tours } from '@/data/tours'

const base = 'https://www.sunskytourism.in'
const now = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packages, destinations] = await Promise.all([getPackages(), getDestinations()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/packages`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tours`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hotels`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/offers`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/travel-guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/plan-your-trip`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/feedback`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cancellation-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const packageRoutes = packages.map((p) => ({
    url: `${base}/packages/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const destinationRoutes = destinations.map((d) => ({
    url: `${base}/destinations/${d.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const guideRoutes = guides.map((g) => ({
    url: `${base}/travel-guides/${g.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const tourRoutes = tours.map((t) => ({
    url: `${base}/tours/${t.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...packageRoutes,
    ...destinationRoutes,
    ...guideRoutes,
    ...tourRoutes,
  ]
}
