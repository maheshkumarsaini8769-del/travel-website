import { notFound } from 'next/navigation'
import TourForm from '@/components/admin/TourForm'
import { toursCollection } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function EditTourPage({ params }: { params: { id: string } }) {
  const col = await toursCollection()
  const tour = await col.findOne({ _id: params.id })
  if (!tour) notFound()

  const initial = {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    destinationId: tour.destinationId,
    destination: tour.destination,
    category: tour.category,
    durationLabel: tour.durationLabel,
    hours: tour.hours,
    tourType: tour.tourType,
    language: tour.language,
    pickup: tour.pickup,
    groupSize: tour.groupSize,
    price: tour.price,
    originalPrice: tour.originalPrice,
    priceLabel: tour.priceLabel,
    availability: tour.availability,
    cancellation: tour.cancellation,
    meetingPoint: tour.meetingPoint,
    accessibility: tour.accessibility,
    tagline: tour.tagline,
    description: tour.description,
    overview: tour.overview,
    images: tour.images || [],
    highlights: tour.highlights || [],
    itinerary: tour.itinerary || [],
    inclusions: tour.inclusions || [],
    exclusions: tour.exclusions || [],
    bestFor: tour.bestFor || [],
    whatToCarry: tour.whatToCarry || [],
    faqs: tour.faqs || [],
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Edit Tour</h1>
      <p className="mt-1 text-sm text-slate-400">{tour.title}</p>
      <div className="mt-6">
        <TourForm initial={initial as any} tourId={tour._id} />
      </div>
    </div>
  )
}
