import { packages as staticPackages, type TravelPackage } from '@/data/packages'
import { destinations as staticDestinations, type Destination } from '@/data/destinations'
import {
  packagesCollection,
  destinationsCollection,
  reviewsCollection,
  hotelsCollection,
  type PackageDoc,
  type DestinationDoc,
  type ReviewDoc,
  type HotelDoc,
} from './db'

// ---------------------------------------------------------------------------
// In-memory cache (resets on cold start; 60 s TTL is enough for dev + prod)
// ---------------------------------------------------------------------------
interface CacheEntry<T> { data: T; ts: number }
const cache = new Map<string, CacheEntry<unknown>>()
const CACHE_TTL = 60_000

function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.data)
  return fn().then((data) => { cache.set(key, { data, ts: Date.now() }); return data })
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))])
}

function toPublic(doc: PackageDoc): TravelPackage {
  const { _id, status, availableDates, maxTravellers, seoTitle, seoDescription, createdAt, updatedAt, ...rest } = doc
  void _id
  void status
  void availableDates
  void maxTravellers
  void seoTitle
  void seoDescription
  void createdAt
  void updatedAt
  return rest
}

function destToPublic(doc: DestinationDoc): Destination {
  return {
    id: doc.slug,
    name: doc.name,
    region: String(doc.categories?.[0] ?? 'India'),
    category: (doc.categories?.includes('International') ? 'International' : doc.categories?.includes('Rajasthan') ? 'Rajasthan' : 'India') as Destination['category'],
    tagline: doc.tagline ?? '',
    description: doc.description,
    overview: doc.description,
    image: doc.image,
    gallery: doc.gallery,
    highlights: doc.highlights,
    popularPlaces: doc.attractions,
    bestTime: doc.bestTime ?? '',
    experience: doc.description,
  }
}

export async function getPackages(): Promise<TravelPackage[]> {
  return cached('packages:all', async () => {
    try {
      const col = await withTimeout(packagesCollection(), 3000)
      const docs = await withTimeout(col.find({ status: { $nin: ['draft', 'archived'] } }).toArray(), 3000)
      const byId = new Map<string, TravelPackage>()
      for (const p of staticPackages) byId.set(p.id, p)
      for (const d of docs) byId.set(d.id, toPublic(d))
      return [...byId.values()]
    } catch {
      return staticPackages
    }
  })
}

export async function getPackageById(id: string, includeAll = false): Promise<TravelPackage | null> {
  try {
    const col = await packagesCollection()
    const doc = await col.findOne({ _id: id })
    if (doc) {
      if (!includeAll && (doc.status === 'draft' || doc.status === 'archived')) {
        // fall through to static for unpublished packages on the public site
      } else {
        return toPublic(doc)
      }
    }
  } catch {
    // fall through to static
  }
  return staticPackages.find((p) => p.id === id) ?? null
}

export async function listDatabasePackages(): Promise<TravelPackage[]> {
  const col = await packagesCollection()
  const docs = await col.find().toArray()
  return docs.map(toPublic)
}

export async function getDestinations(): Promise<Destination[]> {
  return cached('destinations:all', async () => {
    try {
      const col = await withTimeout(destinationsCollection(), 3000)
      const docs = await withTimeout(col.find({ status: { $nin: ['draft'] } }).toArray(), 3000)
      const byId = new Map<string, Destination>()
      for (const d of staticDestinations) byId.set(d.id, d)
      for (const doc of docs) byId.set(doc.slug, destToPublic(doc))
      return [...byId.values()]
    } catch {
      return staticDestinations
    }
  })
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const col = await withTimeout(destinationsCollection(), 3000)
    const doc = await withTimeout(col.findOne({ _id: slug, status: { $nin: ['draft'] } }), 3000)
    if (doc) return destToPublic(doc)
  } catch {
    // fall through to static
  }
  return staticDestinations.find((d) => d.id === slug) ?? null
}

export async function listDatabaseDestinations(): Promise<DestinationDoc[]> {
  const col = await destinationsCollection()
  return col.find().toArray()
}

export async function getReviews(): Promise<ReviewDoc[]> {
  return cached('reviews:approved', async () => {
    try {
      const col = await withTimeout(reviewsCollection(), 3000)
      const docs = await withTimeout(col.find({ approved: true }).sort({ createdAt: -1 }).limit(12).toArray(), 3000)
      return docs
    } catch {
      return []
    }
  })
}

export async function getHotels(): Promise<HotelDoc[]> {
  return cached('hotels:published', async () => {
    try {
      const col = await withTimeout(hotelsCollection(), 3000)
      const docs = await withTimeout(col.find({ status: { $nin: ['draft'] } }).toArray(), 3000)
      return docs
    } catch {
      return []
    }
  })
}

export async function getHotelsPublic() {
  const { hotels: staticHotels } = await import('@/data/hotels')
  try {
    const col = await hotelsCollection()
    const docs = await col.find({ status: { $nin: ['draft'] } }).toArray()
    const dbHotels = docs.map((d) => ({
      id: d._id,
      name: d.name,
      city: d.location,
      type: `${d.stars}-Star Hotel`,
      description: d.description || '',
      rating: d.stars,
      reviewCount: 0,
      priceFrom: d.roomTypes?.[0]?.price ?? 0,
      originalPrice: Math.round((d.roomTypes?.[0]?.price ?? 0) * 1.3),
      image: d.images?.[0] || '/images/placeholder-hotel.svg',
      amenities: d.amenities || [],
      idealFor: [],
      distanceNote: '',
    }))
    const byId = new Map<string, typeof staticHotels[number]>()
    for (const h of staticHotels) byId.set(h.id, h)
    for (const h of dbHotels) byId.set(h.id, h as any)
    return [...byId.values()]
  } catch {
    return staticHotels
  }
}
