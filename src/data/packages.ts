import { packageImages, packageGalleries } from './images'

export type PackageCategory = 'India' | 'Rajasthan' | 'Beach' | 'Mountain' | 'International'
export type PackageTheme = 'Heritage' | 'Honeymoon' | 'Family' | 'Adventure' | 'Beach' | 'Luxury' | 'Nature'

export interface ItineraryDay {
  day: number
  title: string
  text: string
}

export interface TravelPackage {
  id: string
  name: string
  duration: string
  nights: string
  region: string
  categories: PackageCategory[]
  theme: PackageTheme[]
  tagline: string
  description: string
  overview: string
  pricePerPerson: number
  originalPrice: number
  currency: string
  basis: string
  validity: string
  rating: number
  reviewCount: number
  image: string
  gallery: string[]
  highlights: string[]
  places: string[]
  activities: string[]
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  accommodation: string
  meals: string
  hotelCategories: string
  transportation: string
  featured: boolean
}

export const packages: TravelPackage[] = [
  {
    id: 'rajasthan-heritage',
    name: 'Rajasthan Heritage Tour',
    duration: '5 Days',
    nights: '4N / 5D',
    region: 'Rajasthan',
    categories: ['Rajasthan', 'India'],
    theme: ['Heritage', 'Family'],
    tagline: 'Forts, palaces and desert sunsets',
    description: 'A royal circuit through Jaipur, Jodhpur, Jaisalmer and Udaipur.',
    overview:
      'Travel the royal road of Rajasthan — pink Jaipur, blue Jodhpur, golden Jaisalmer and lakeside Udaipur — with guided heritage walks, palace visits and a night at a luxury desert camp under the stars.',
    pricePerPerson: 18499,
    originalPrice: 21999,
    currency: '₹',
    basis: 'per person on twin sharing',
    validity: 'Valid until 31 March 2026',
    rating: 4.9,
    reviewCount: 312,
    image: packageImages['rajasthan-heritage'],
    gallery: packageGalleries['rajasthan-heritage'],
    highlights: ['Amber Fort', 'Mehrangarh Fort', 'Sam Sand Dunes Camp', 'Lake Pichola Boat Ride'],
    places: ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'],
    activities: ['Heritage walks', 'Palace visits', 'Camel safari', 'Sunset boat ride', 'Folk music evening'],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur Arrival — Pink City',
        text: 'Arrive in Jaipur, check into a heritage hotel and take a relaxed evening walk through the pink-walled old city and Johari Bazaar.',
      },
      {
        day: 2,
        title: 'Jaipur Sightseeing — Amber & City Palace',
        text: 'Morning visit to Amber Fort (elephant ride optional), then City Palace, Hawa Mahal and Jantar Mantar. Overnight in Jaipur.',
      },
      {
        day: 3,
        title: 'Jaipur → Jodhpur',
        text: 'Drive to Jodhpur, visit Mehrangarh Fort and Jaswant Thada, and explore the blue city lanes in the evening. Overnight in Jodhpur.',
      },
      {
        day: 4,
        title: 'Jodhpur → Jaisalmer — Desert Night',
        text: 'Drive to Jaisalmer, visit the living fort and Patwon Ki Haveli, then head to Sam Sand Dunes for a camel safari, folk evening and luxury desert camp.',
      },
      {
        day: 5,
        title: 'Jaisalmer → Udaipur → Departure',
        text: 'Drive to Udaipur for a sunset boat ride on Lake Pichola, then transfer for your onward journey. Tour ends.',
      },
    ],
    inclusions: [
      'Accommodation in handpicked heritage hotels on twin sharing',
      'Luxury desert camp night at Sam Sand Dunes with dinner & breakfast',
      'Daily breakfast, lunch and dinner at all hotels',
      'Private air-conditioned cab with experienced driver throughout',
      'All tolls, parking, fuel and driver allowance',
      'Sunset boat ride on Lake Pichola',
      '24×7 on-trip WhatsApp support',
    ],
    exclusions: [
      'Airfare / railway tickets',
      'Monument entry fees and camera charges',
      'Personal expenses, tips, laundry, mineral water',
      'Travel insurance',
      'Anything not listed in inclusions',
    ],
    accommodation: 'Handpicked heritage hotels and a luxury desert camp at Sam Sand Dunes.',
    meals: 'All meals included — daily breakfast, lunch and dinner. Dinner included at the desert camp.',
    hotelCategories: 'Heritage & 3-star category hotels',
    transportation: 'Private air-conditioned cab with an experienced driver throughout the tour.',
    featured: true,
  },
  {
    id: 'goa-holiday',
    name: 'Goa Holiday',
    duration: '4 Days',
    nights: '3N / 4D',
    region: 'Goa',
    categories: ['Beach', 'India'],
    theme: ['Beach', 'Family', 'Honeymoon'],
    tagline: 'Sun, sand and slow evenings',
    description: 'Beach resorts, water sports and Portuguese charm.',
    overview:
      'The perfect beach escape — stay in a beachfront resort, hop between Baga and Palolem, try water sports, and explore Old Goa\u2019s churches and forts.',
    pricePerPerson: 14999,
    originalPrice: 17999,
    currency: '₹',
    basis: 'per person on twin sharing',
    validity: 'Valid until 31 March 2026',
    rating: 4.7,
    reviewCount: 248,
    image: packageImages['goa-holiday'],
    gallery: packageGalleries['goa-holiday'],
    highlights: ['Beachfront stay', 'Water sports', 'Sunset cruise', 'Old Goa churches'],
    places: ['Baga', 'Calangute', 'Palolem', 'Old Goa'],
    activities: ['Jet skiing', 'Parasailing', 'Sunset cruise', 'Beach hopping', 'Sea food dinner'],
    itinerary: [
      {
        day: 1,
        title: 'Goa Arrival — Beach Check-in',
        text: 'Arrive at Goa airport or railway station, transfer to your beach resort at Baga and spend the evening by the sand.',
      },
      {
        day: 2,
        title: 'North Goa — Baga & Fort Aguada',
        text: 'Morning at Baga and Calangute beaches, visit Fort Aguada, then an afternoon of water sports (jet ski, parasailing, banana boat).',
      },
      {
        day: 3,
        title: 'Old Goa & South Goa',
        text: 'Visit the Basilica of Bom Jesus and Old Goa churches in the morning, then drive down to Palolem beach. Evening sunset cruise.',
      },
      {
        day: 4,
        title: 'Departure',
        text: 'Leisure morning at the resort, then transfer to the airport or railway station for your onward journey.',
      },
    ],
    inclusions: [
      'Accommodation in beach resorts on twin sharing',
      'Daily breakfast, lunch and dinner',
      'Private cab for sightseeing with pickup & drop',
      'Water sports package (jet ski + parasailing)',
      'Sunset cruise with live music',
      'All tolls, parking, fuel and driver allowance',
    ],
    exclusions: [
      'Airfare / railway tickets',
      'Personal expenses, tips, laundry',
      'Travel insurance',
      'Anything not listed in inclusions',
    ],
    accommodation: 'Comfortable beach resorts with sea-facing options available.',
    meals: 'All meals included — daily breakfast, lunch and dinner.',
    hotelCategories: '3-star beach resorts',
    transportation: 'Private cab for sightseeing with pickup and drop from the airport or railway station.',
    featured: false,
  },
  {
    id: 'kashmir-escape',
    name: 'Kashmir Escape',
    duration: '6 Days',
    nights: '5N / 6D',
    region: 'Kashmir',
    categories: ['Mountain', 'India'],
    theme: ['Honeymoon', 'Nature'],
    tagline: 'Snow peaks and shikaras on Dal Lake',
    description: 'Srinagar, Gulmarg and Pahalgam in one serene journey.',
    overview:
      'Drift on Dal Lake in a shikara, ride the Gulmarg gondola to snowline, and wander Pahalgam\u2019s meadows — Kashmir at its most peaceful.',
    pricePerPerson: 20999,
    originalPrice: 24999,
    currency: '₹',
    basis: 'per person on twin sharing',
    validity: 'Valid until 31 March 2026',
    rating: 4.8,
    reviewCount: 201,
    image: packageImages['kashmir-escape'],
    gallery: packageGalleries['kashmir-escape'],
    highlights: ['Houseboat stay', 'Gulmarg Gondola', 'Pahalgam meadows', 'Mughal gardens'],
    places: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg'],
    activities: ['Shikara ride', 'Gondola ride', 'Horse rides', 'Meadow picnics', 'Shawl shopping'],
    itinerary: [
      {
        day: 1,
        title: 'Srinagar Arrival — Dal Lake',
        text: 'Arrive in Srinagar, transfer to your heritage houseboat on Dal Lake. Evening shikara ride around the lake and floating gardens.',
      },
      {
        day: 2,
        title: 'Srinagar — Mughal Gardens & City',
        text: 'Visit Shalimar, Nishat and Chashme Shahi gardens, then the old city, Jamia Masjid and the famous shawl & carpet emporiums.',
      },
      {
        day: 3,
        title: 'Srinagar → Gulmarg',
        text: 'Drive to Gulmarg, ride the world-famous Gondola to Kongdori and Apharwat snowline. Overnight in Gulmarg.',
      },
      {
        day: 4,
        title: 'Gulmarg → Pahalgam',
        text: 'Drive through pine forests to Pahalgam. Walk along the Lidder river, visit Betaab Valley and Aru meadow.',
      },
      {
        day: 5,
        title: 'Pahalgam → Sonamarg Excursion',
        text: 'Day trip to Sonamarg — the meadow of gold — with optional horse ride to Thajiwas Glacier. Return to Pahalgam.',
      },
      {
        day: 6,
        title: 'Departure from Srinagar',
        text: 'Drive back to Srinagar airport with souvenir shopping stop. Tour ends.',
      },
    ],
    inclusions: [
      'Heritage houseboat stay in Srinagar (2 nights)',
      'Hotels in Gulmarg & Pahalgam on twin sharing',
      'Daily breakfast, lunch and dinner',
      'Private cab with local driver throughout',
      'Gulmarg Gondola (Phase 1) tickets',
      'Shikara ride on Dal Lake',
    ],
    exclusions: [
      'Airfare / railway tickets',
      'Entry fees and pony rides',
      'Personal expenses, tips, laundry',
      'Travel insurance',
      'Anything not listed in inclusions',
    ],
    accommodation: 'Heritage houseboat on Dal Lake plus comfortable valley hotels.',
    meals: 'All meals included — daily breakfast, lunch and dinner.',
    hotelCategories: 'Houseboat + 3-star valley hotels',
    transportation: 'Private cab with local driver familiar with the mountain routes.',
    featured: false,
  },
  {
    id: 'dubai-experience',
    name: 'Dubai Experience',
    duration: '5 Days',
    nights: '4N / 5D',
    region: 'Dubai',
    categories: ['International'],
    theme: ['Luxury', 'Honeymoon', 'Family'],
    tagline: 'Skyline days, desert nights',
    description: 'Burj Khalifa, desert safari and the Dubai Marina.',
    overview:
      'A modern city escape — top the Burj Khalifa, cruise the Marina, spend an evening on a red-dune desert safari and shop till you drop at Dubai Mall.',
    pricePerPerson: 54999,
    originalPrice: 64999,
    currency: '₹',
    basis: 'per person on twin sharing (land only)',
    validity: 'Valid until 30 April 2026',
    rating: 4.8,
    reviewCount: 156,
    image: packageImages['dubai-experience'],
    gallery: packageGalleries['dubai-experience'],
    highlights: ['Burj Khalifa', 'Desert safari', 'Marina cruise', 'Dubai Mall'],
    places: ['Downtown Dubai', 'Marina', 'Jumeirah', 'Desert Reserve'],
    activities: ['Desert dune bashing', 'Camel ride', 'Dhow cruise', 'Burj fountain show', 'City tour'],
    itinerary: [
      {
        day: 1,
        title: 'Dubai Arrival — Marina Evening',
        text: 'Arrive at Dubai airport, private transfer to your 4-star hotel. Evening dhow cruise dinner along Dubai Marina.',
      },
      {
        day: 2,
        title: 'City Tour & Burj Khalifa',
        text: 'Half-day city tour — Jumeirah Mosque, Palm Jumeirah, Atlantis. Evening: At the Top, Burj Khalifa observation deck and the fountain show.',
      },
      {
        day: 3,
        title: 'Desert Safari',
        text: 'Afternoon red-dune desert safari with dune bashing, camel ride, sandboarding, BBQ dinner and live dance performances at a desert camp.',
      },
      {
        day: 4,
        title: 'Leisure & Shopping',
        text: 'Free day for Dubai Mall, Souk Madinat, Miracle Garden or a Grand Mosque visit (self-drive / optional tour).',
      },
      {
        day: 5,
        title: 'Departure',
        text: 'Private transfer to Dubai airport for your flight home. Tour ends.',
      },
    ],
    inclusions: [
      '4-star hotel stay in central Dubai on twin sharing',
      'Daily breakfast, lunch and dinner',
      'Airport transfers & private city tour',
      'Burj Khalifa (At the Top) tickets',
      'Evening desert safari with BBQ dinner',
      'Dhow cruise dinner at Dubai Marina',
    ],
    exclusions: [
      'International airfare',
      'Dubai visit visa fees',
      'Personal expenses, tips, shopping',
      'Travel insurance',
      'Anything not listed in inclusions',
    ],
    accommodation: 'Centrally located 4-star city hotels with breakfast.',
    meals: 'All meals included — daily breakfast, lunch and dinner (including cruise & safari dinners).',
    hotelCategories: '4-star city hotels',
    transportation: 'Airport transfers and private city tours arranged by our team.',
    featured: false,
  },
  {
    id: 'himachal-adventure',
    name: 'Himachal Adventure',
    duration: '5 Days',
    nights: '4N / 5D',
    region: 'Himachal',
    categories: ['Mountain', 'India'],
    theme: ['Adventure', 'Nature'],
    tagline: 'Mountain roads, pine forests, bonfire nights',
    description: 'Manali and Solang Valley for the adventurous soul.',
    overview:
      'Head up the mountains to Manali — river rafting, Solang Valley adventures, temple visits and long drives through pine forests and apple orchards.',
    pricePerPerson: 16499,
    originalPrice: 19499,
    currency: '₹',
    basis: 'per person on twin sharing',
    validity: 'Valid until 31 March 2026',
    rating: 4.6,
    reviewCount: 187,
    image: packageImages['himachal-adventure'],
    gallery: packageGalleries['himachal-adventure'],
    highlights: ['Solang Valley', 'River rafting', 'Old Manali cafés', 'Mountain drives'],
    places: ['Manali', 'Solang Valley', 'Kullu', 'Naggar'],
    activities: ['Paragliding', 'River rafting', 'Zipline', 'Temple visits', 'Bonfire evenings'],
    itinerary: [
      {
        day: 1,
        title: 'Manali Arrival',
        text: 'Arrive in Manali, check into a cosy valley-view hotel and take a relaxed stroll through Old Manali cafés by the river.',
      },
      {
        day: 2,
        title: 'Solang Valley Adventure',
        text: 'Full day at Solang Valley — zipline, snow activities and adventure sports. Optional paragliding (seasonal).',
      },
      {
        day: 3,
        title: 'Kullu River Rafting & Naggar',
        text: 'Morning white-water rafting on the Beas river, then visit Naggar Castle and Nicholas Roerich Art Gallery.',
      },
      {
        day: 4,
        title: 'Hadimba Temple & Local Markets',
        text: 'Visit Hadimba Devi Temple, Vashisht hot springs and Manu Temple. Evening bonfire with music at the resort.',
      },
      {
        day: 5,
        title: 'Departure',
        text: 'Breakfast, souvenir shopping in Mall Road, then transfer to your transport for onward journey. Tour ends.',
      },
    ],
    inclusions: [
      'Accommodation in mountain hotels on twin sharing',
      'Daily breakfast, lunch and dinner',
      'Private cab with experienced driver throughout',
      'River rafting session (Kullu)',
      'Zipline at Solang Valley',
      'Bonfire evening at the resort',
    ],
    exclusions: [
      'Airfare / railway tickets',
      'Paragliding (seasonal, payable on spot)',
      'Entry fees and personal expenses',
      'Travel insurance',
      'Anything not listed in inclusions',
    ],
    accommodation: 'Cosy mountain hotels with valley views near Old Manali.',
    meals: 'All meals included — daily breakfast, lunch and dinner.',
    hotelCategories: '3-star mountain hotels',
    transportation: 'Private cab through the mountain routes with experienced driver.',
    featured: false,
  },
]

export const packageById = (id: string) => packages.find((p) => p.id === id)

export const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`

export const savePercent = (pkg: TravelPackage) =>
  Math.round(((pkg.originalPrice - pkg.pricePerPerson) / pkg.originalPrice) * 100)
