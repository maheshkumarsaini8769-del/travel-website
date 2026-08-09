import { hotelImages } from './images'

export interface Hotel {
  id: string
  name: string
  city: string
  type: string
  description: string
  rating: number
  reviewCount: number
  priceFrom: number
  originalPrice: number
  image: string
  amenities: string[]
  idealFor: string[]
  distanceNote: string
}

export const hotels: Hotel[] = [
  {
    id: 'rambagh-jaipur',
    name: 'Rambagh Palace',
    city: 'Jaipur',
    type: 'Heritage Palace Hotel',
    description:
      'A former royal residence turned luxury heritage hotel — sprawling gardens, marble courtyards and old-world hospitality in the heart of the Pink City.',
    rating: 4.9,
    reviewCount: 1284,
    priceFrom: 18500,
    originalPrice: 24000,
    image: hotelImages.jaipur,
    amenities: ['Free Breakfast', 'Swimming Pool', 'Spa & Wellness', 'Restaurant', 'Free WiFi', 'Laundry'],
    idealFor: ['Honeymoon', 'Heritage lovers', 'Luxury stays'],
    distanceNote: '6 km from Jaipur airport · 2 km from Hawa Mahal',
  },
  {
    id: 'taj-lake-udaipur',
    name: 'Taj Lake Palace',
    city: 'Udaipur',
    type: 'Lake Palace Hotel',
    description:
      'A marble palace floating on Lake Pichola — reachable only by boat, with views of the Aravalli hills from every suite.',
    rating: 4.9,
    reviewCount: 1567,
    priceFrom: 32000,
    originalPrice: 42000,
    image: hotelImages.udaipur,
    amenities: ['Boat Transfer', 'Lake View Rooms', 'Fine Dining', 'Spa', 'Concierge', 'Free Breakfast'],
    idealFor: ['Honeymoon', 'Romantic getaways', 'Anniversaries'],
    distanceNote: 'Boat ride from City Palace jetty · 22 km from Udaipur airport',
  },
  {
    id: 'desert-camp-jaisalmer',
    name: 'Sunset Luxury Desert Camp',
    city: 'Jaisalmer',
    type: 'Luxury Desert Camp',
    description:
      'Swiss tents with attached bathrooms on the Sam Sand Dunes — camel safaris, folk performances and dinner under a sky full of stars.',
    rating: 4.8,
    reviewCount: 932,
    priceFrom: 7999,
    originalPrice: 9999,
    image: hotelImages.jaisalmer,
    amenities: ['Swiss Tents', 'Camel Safari', 'Folk Night', 'Buffet Dinner', 'Bonfire', 'Hot Water'],
    idealFor: ['Family', 'Group trips', 'Photographers'],
    distanceNote: '≈ 45 km from Jaisalmer city · on the Sam Sand Dunes',
  },
  {
    id: 'goa-beach-resort',
    name: 'Beachfront Resort — Baga',
    city: 'Goa',
    type: 'Beach Resort',
    description:
      'Sea-facing rooms, a poolside bar and steps away from Baga beach — the classic Goa resort experience with water sports at the doorstep.',
    rating: 4.6,
    reviewCount: 2103,
    priceFrom: 8999,
    originalPrice: 12999,
    image: hotelImages.goa,
    amenities: ['Beach Access', 'Swimming Pool', 'Water Sports Desk', 'Restaurant', 'Free WiFi', 'Parking'],
    idealFor: ['Family', 'Beach lovers', 'Budget luxury'],
    distanceNote: '2-minute walk to Baga beach · 40 km from Dabolim airport',
  },
  {
    id: 'dal-lake-houseboat',
    name: 'Deluxe Houseboat — Dal Lake',
    city: 'Srinagar',
    type: 'Heritage Houseboat',
    description:
      'A carved walnut-wood houseboat on Dal Lake with a private shikara, valley views and slow mornings on the water.',
    rating: 4.8,
    reviewCount: 1189,
    priceFrom: 6999,
    originalPrice: 8999,
    image: hotelImages.kashmir,
    amenities: ['Private Shikara', 'Lake View', 'All Meals', 'Heaters', 'Sitting Lounge', 'Free Parking'],
    idealFor: ['Honeymoon', 'Nature lovers', 'Slow travel'],
    distanceNote: 'On Dal Lake boulevard · 15 km from Srinagar airport',
  },
  {
    id: 'manali-mountain-resort',
    name: 'Mountain View Resort — Manali',
    city: 'Manali',
    type: 'Mountain Resort',
    description:
      'Valley-facing cottages near Old Manali, pine forest walks at sunrise and cosy bonfire evenings after a day of adventure.',
    rating: 4.5,
    reviewCount: 876,
    priceFrom: 5499,
    originalPrice: 7999,
    image: hotelImages.manali,
    amenities: ['Valley View', 'Bonfire', 'Restaurant', 'Free WiFi', 'Hot Water', 'Parking'],
    idealFor: ['Adventure', 'Couples', 'Workation'],
    distanceNote: '1.5 km from Old Manali cafés · 52 km from Kullu–Bhuntar airport',
  },
]

export const hotelById = (id: string) => hotels.find((h) => h.id === id)

export const hotelCities = [...new Set(hotels.map((h) => h.city))]

export const formatHotelPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`
