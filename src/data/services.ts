import {
  Plane,
  Hotel,
  Map,
  CalendarHeart,
  FileBadge,
  CarFront,
  type LucideIcon,
} from 'lucide-react'
import { serviceImages } from './images'

export interface Service {
  id: string
  name: string
  icon: LucideIcon
  short: string
  description: string
  benefits: string[]
  image: string
}

export const services: Service[] = [
  {
    id: 'flights',
    name: 'Flights',
    icon: Plane,
    short: 'Best flight deals worldwide',
    description:
      'Domestic and international flight bookings at the best available fares, with support for date changes, cancellations and group bookings.',
    benefits: ['Domestic & international', 'Best fare comparison', 'Group bookings', 'Reschedule assistance'],
    image: serviceImages.flights,
  },
  {
    id: 'hotels',
    name: 'Hotels',
    icon: Hotel,
    short: 'Premium accommodations',
    description:
      'Handpicked hotels, resorts, houseboats and camps matched to your budget and taste — from heritage stays to beachfront luxury.',
    benefits: ['Curated properties', 'Verified reviews', 'Best rates', 'Family-friendly options'],
    image: serviceImages.hotels,
  },
  {
    id: 'tours',
    name: 'Tour Packages',
    icon: Map,
    short: 'Curated experiences',
    description:
      'Complete travel packages built around how you want to travel — culture, adventure, beaches or mountains, planned down to the last detail.',
    benefits: ['Fully customized', 'Local guides', 'Sightseeing planned', 'No hidden costs'],
    image: serviceImages.tours,
  },
  {
    id: 'holidays',
    name: 'Holiday Plans',
    icon: CalendarHeart,
    short: 'All-inclusive getaways',
    description:
      'Honeymoons, family vacations and group holidays with flights, stays, meals and experiences arranged so you simply arrive and enjoy.',
    benefits: ['Honeymoon planning', 'Family packages', 'Group holidays', 'All-inclusive options'],
    image: serviceImages.holidays,
  },
  {
    id: 'visa',
    name: 'Visa Assistance',
    icon: FileBadge,
    short: 'Hassle-free visas',
    description:
      'Documentation guidance and application support for international travel, so your visa process is smooth, accurate and on time.',
    benefits: ['Document checklist', 'Application guidance', 'Appointment support', 'Update tracking'],
    image: serviceImages.visa,
  },
  {
    id: 'transport',
    name: 'Transportation',
    icon: CarFront,
    short: 'Comfortable travel',
    description:
      'Airport transfers, sightseeing cabs and long-distance travel arranged with professional drivers and well-maintained vehicles.',
    benefits: ['Airport transfers', 'Sightseeing cabs', 'Long-distance travel', 'Experienced drivers'],
    image: serviceImages.transport,
  },
]
