import { destinations } from '@/data/destinations'
import { tours } from '@/data/tours'
import { packages } from '@/data/packages'
import { guides } from '@/data/guides'
import type { TravelPackage } from '@/data/packages'

export interface SearchItem {
  title: string
  subtitle: string
  href: string
  image: string
  type: 'Destination' | 'Tour' | 'Package' | 'Guide'
}

export function searchItems(query: string, pkgs: TravelPackage[] = packages): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const index: SearchItem[] = [
    ...destinations.map((d) => ({
      title: d.name,
      subtitle: d.tagline,
      href: `/destinations/${d.id}`,
      image: d.image,
      type: 'Destination' as const,
    })),
    ...tours.map((t) => ({
      title: t.title,
      subtitle: `${t.destination} · ${t.durationLabel} · ${t.category}`,
      href: `/tours/${t.id}`,
      image: t.images[0],
      type: 'Tour' as const,
    })),
    ...pkgs.map((p) => ({
      title: p.name,
      subtitle: `${p.duration} · ${p.region}`,
      href: `/packages/${p.id}`,
      image: p.image,
      type: 'Package' as const,
    })),
    ...guides.map((g) => ({
      title: g.title,
      subtitle: `${g.category} · ${g.readTime}`,
      href: `/travel-guides/${g.slug}`,
      image: g.image,
      type: 'Guide' as const,
    })),
  ]
  return index
    .filter((item) => `${item.title} ${item.subtitle} ${item.type}`.toLowerCase().includes(q))
    .slice(0, 24)
}

export function groupByType(items: SearchItem[]): SearchItem[][] {
  const order: SearchItem['type'][] = ['Destination', 'Tour', 'Package', 'Guide']
  return order
    .map((type) => items.filter((i) => i.type === type))
    .filter((group) => group.length > 0)
}

export const typeLabel: Record<SearchItem['type'], string> = {
  Destination: 'Destinations',
  Tour: 'Tours & Activities',
  Package: 'Holiday Packages',
  Guide: 'Travel Guides',
}
