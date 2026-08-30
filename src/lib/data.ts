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
  try {
    const col = await packagesCollection()
    const docs = await col.find({ status: { $nin: ['draft', 'archived'] } }).toArray()
    const byId = new Map<string, TravelPackage>()
    for (const p of staticPackages) byId.set(p.id, p)
    for (const d of docs) byId.set(d.id, toPublic(d))
    return [...byId.values()]
  } catch {
    return staticPackages
  }
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
  try {
    const col = await destinationsCollection()
    const docs = await col.find({ status: { $nin: ['draft'] } }).toArray()
    const byId = new Map<string, Destination>()
    for (const d of staticDestinations) byId.set(d.id, d)
    for (const doc of docs) byId.set(doc.slug, destToPublic(doc))
    return [...byId.values()]
  } catch {
    return staticDestinations
  }
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const col = await destinationsCollection()
    const doc = await col.findOne({ _id: slug, status: { $nin: ['draft'] } })
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
  try {
    const col = await reviewsCollection()
    const docs = await col.find({ approved: true }).sort({ createdAt: -1 }).limit(12).toArray()
    return docs
  } catch {
    return []
  }
}

export async function getHotels(): Promise<HotelDoc[]> {
  try {
    const col = await hotelsCollection()
    const docs = await col.find({ status: { $nin: ['draft'] } }).toArray()
    return docs
  } catch {
    return []
  }
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
      image: d.images?.[0] || '/images/placeholder-hotel.webp',
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
