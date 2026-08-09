import { destinationImages, destinationGalleries } from './images'

export type DestinationCategory = 'Rajasthan' | 'India' | 'International'

export interface Destination {
  id: string
  name: string
  region: string
  category: DestinationCategory
  tagline: string
  description: string
  overview: string
  image: string
  gallery: string[]
  highlights: string[]
  popularPlaces: string[]
  bestTime: string
  experience: string
}

export const destinations: Destination[] = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    region: 'Rajasthan',
    category: 'Rajasthan',
    tagline: 'The Pink City of India',
    description: 'Palaces, forts and bazaars painted in rose pink.',
    overview:
      'Jaipur, the capital of Rajasthan, blends royal heritage with vibrant bazaars. Explore the Amber Fort, City Palace and the celestial observatory of Jantar Mantar, all within a city planned for kings.',
    image: destinationImages.jaipur,
    gallery: destinationGalleries.jaipur,
    highlights: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar', 'Local Bazaar Shopping'],
    popularPlaces: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jal Mahal', 'Nahargarh Fort'],
    bestTime: 'October – March',
    experience:
      'Wander the pink-walled old city at sunrise, ride an elephant up to Amber Fort, and sip chai overlooking Jal Mahal — a day that feels like a royal chronicle.',
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    region: 'Rajasthan',
    category: 'Rajasthan',
    tagline: 'City of Lakes',
    description: 'Romantic lakes, marble palaces and sunset boat rides.',
    overview:
      'Udaipur is Rajasthan\u2019s most romantic city. Glide across Lake Pichola, marvel at the City Palace and feel the calm of its marble courtyards surrounded by the Aravalli hills.',
    image: destinationImages.udaipur,
    gallery: destinationGalleries.udaipur,
    highlights: ['Lake Pichola Boat Ride', 'City Palace', 'Jag Mandir', 'Sajjangarh Monsoon Palace', 'Old City Walks'],
    popularPlaces: ['Lake Pichola', 'City Palace', 'Jagdish Temple', 'Fateh Sagar Lake', 'Kumbhalgarh'],
    bestTime: 'September – March',
    experience:
      'End the day with a sunset boat ride on Lake Pichola as the City Palace glows amber — the postcard moment of every Udaipur journey.',
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer',
    region: 'Rajasthan',
    category: 'Rajasthan',
    tagline: 'The Golden City in the Desert',
    description: 'Sand dunes, camel safaris and a living fort of gold.',
    overview:
      'Rising from the Thar desert, Jaisalmer is a living fort city of carved sandstone. Experience camel safaris, desert camps and star-lit nights at the Sam dunes.',
    image: destinationImages.jaisalmer,
    gallery: destinationGalleries.jaisalmer,
    highlights: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Camel Safari', 'Desert Camping', 'Patwon Ki Haveli'],
    popularPlaces: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Patwon Ki Haveli', 'Gadisar Lake', 'Kuldhara Village'],
    bestTime: 'October – February',
    experience:
      'Ride a camel into the dunes as the sun melts into the horizon, then sleep under a sky so clear it feels hand-painted.',
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    region: 'Rajasthan',
    category: 'Rajasthan',
    tagline: 'The Blue City',
    description: 'A blue old town beneath the mighty Mehrangarh Fort.',
    overview:
      'Jodhpur\u2019s blue-washed lanes sit in the shadow of Mehrangarh, one of India\u2019s grandest forts. Walk the old city, taste Marwari cuisine and watch the sunset from the fort ramparts.',
    image: destinationImages.jodhpur,
    gallery: destinationGalleries.jodhpur,
    highlights: ['Mehrangarh Fort', 'Blue City Walk', 'Jaswant Thada', 'Clock Tower Market', 'Marwari Cuisine'],
    popularPlaces: ['Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan Palace', 'Sardar Market', 'Ghanta Ghar'],
    bestTime: 'October – March',
    experience:
      'Stand on the ramparts of Mehrangarh at golden hour and watch the blue city spread out below like a living canvas.',
  },
  {
    id: 'delhi',
    name: 'Delhi',
    region: 'India',
    category: 'India',
    tagline: 'Capital of Contrasts',
    description: 'Mughal monuments, bazaars and modern landmarks.',
    overview:
      'Delhi layers seven cities into one. From the Red Fort and Jama Masjid to India Gate and the Lotus Temple, every corner holds a different era of Indian history.',
    image: destinationImages.delhi,
    gallery: destinationGalleries.delhi,
    highlights: ['Red Fort', 'India Gate', 'Qutub Minar', 'Humayun\u2019s Tomb', 'Chandni Chowk'],
    popularPlaces: ['Red Fort', 'India Gate', 'Qutub Minar', 'Lotus Temple', 'Akshardham'],
    bestTime: 'October – March',
    experience:
      'Cycle through Old Delhi\u2019s spice lanes in the morning and stand beneath the canopy of India Gate at night — two worlds, one city.',
  },
  {
    id: 'goa',
    name: 'Goa',
    region: 'India',
    category: 'India',
    tagline: 'Beach Paradise',
    description: 'Golden beaches, water sports and Portuguese charm.',
    overview:
      'Goa is India\u2019s beach escape. Relax on golden sands, ride the waves, explore Portuguese churches and old forts, and unwind at beachside shacks by the Arabian Sea.',
    image: destinationImages.goa,
    gallery: destinationGalleries.goa,
    highlights: ['Beach Hopping', 'Water Sports', 'Old Goa Churches', 'Dudhsagar Falls', 'Sunset Cruises'],
    popularPlaces: ['Baga Beach', 'Palolem Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Dudhsagar Falls'],
    bestTime: 'November – February',
    experience:
      'Trade the itinerary for a hammock, a coconut and a sunset at Palolem — Goa works best when you slow down.',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    region: 'India',
    category: 'India',
    tagline: 'Heaven on Earth',
    description: 'Snow peaks, Dal Lake shikaras and Mughal gardens.',
    overview:
      'Kashmir is a valley of emerald meadows, snow-capped mountains and the still waters of Dal Lake. Float in a shikara, walk Mughal gardens and breathe the cleanest air in India.',
    image: destinationImages.kashmir,
    gallery: destinationGalleries.kashmir,
    highlights: ['Dal Lake Shikara Ride', 'Gulmarg Gondola', 'Pahalgam Meadows', 'Mughal Gardens', 'Sonamarg Snow'],
    popularPlaces: ['Dal Lake', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Shalimar Garden'],
    bestTime: 'April – October / December – February for snow',
    experience:
      'Glide across Dal Lake at dawn with mist curling off the water, snow peaks watching from every direction.',
  },
  {
    id: 'himachal',
    name: 'Himachal',
    region: 'India',
    category: 'India',
    tagline: 'Mountain Serenity',
    description: 'Hill stations, pine forests and Himalayan roads.',
    overview:
      'Himachal Pradesh is the land of mountain towns — Manali, Shimla and Dharamshala — wrapped in pine forests, river valleys and crisp Himalayan air. Perfect for treks and slow mornings.',
    image: destinationImages.himachal,
    gallery: destinationGalleries.himachal,
    highlights: ['Solang Valley', 'Rohtang Pass', 'Shimla Mall Road', 'Manali Old Town', 'River Rafting'],
    popularPlaces: ['Manali', 'Shimla', 'Dharamshala', 'Kasol', 'Solang Valley'],
    bestTime: 'March – June / December – February for snow',
    experience:
      'Wake up to pine-scented air, spend the day on mountain trails and end it by a bonfire under a sky full of stars.',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    region: 'UAE',
    category: 'International',
    tagline: 'Modern Oasis',
    description: 'Skyscrapers, desert safaris and luxury shopping.',
    overview:
      'Dubai is where the future meets the desert. Ride to the top of Burj Khalifa, cruise the Marina, safari through red dunes and shop in the world\u2019s grandest malls.',
    image: destinationImages.dubai,
    gallery: destinationGalleries.dubai,
    highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Marina', 'Palm Jumeirah', 'Dubai Mall'],
    popularPlaces: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Marina', 'Global Village', 'Miracle Garden'],
    bestTime: 'November – March',
    experience:
      'Watch the Burj Khalifa light up over a dinner cruise, then swap the skyline for star-lit desert dunes the next evening.',
  },
  {
    id: 'international',
    name: 'International',
    region: 'Worldwide',
    category: 'International',
    tagline: 'Global Destinations',
    description: 'Curated tours across the world\u2019s most loved cities.',
    overview:
      'Beyond India, we plan journeys across the globe — from the streets of Paris to the islands of Southeast Asia. Flights, stays, visas and experiences, handled end to end.',
    image: destinationImages.international,
    gallery: destinationGalleries.international,
    highlights: ['Visa Assistance', 'Flight Booking', 'Hotel Stays', 'Guided Tours', 'Travel Insurance'],
    popularPlaces: ['Paris', 'Singapore', 'Bali', 'Thailand', 'Maldives'],
    bestTime: 'Varies by destination',
    experience:
      'Tell us where you want to go and let our team handle the flights, visas, stays and every detail in between.',
  },
]

export const destinationById = (id: string) => destinations.find((d) => d.id === id)

export interface DestinationExtra {
  rating: number
  reviewCount: number
  idealDuration: string
  distanceFromSikar: string
  howToReach: { air: string; rail: string; road: string }
}

export const destinationExtras: Record<string, DestinationExtra> = {
  jaipur: {
    rating: 4.9,
    reviewCount: 412,
    idealDuration: '2–3 days',
    distanceFromSikar: '≈ 115 km (2.5 hrs by road)',
    howToReach: {
      air: 'Jaipur International Airport (JAI) — direct flights from Delhi, Mumbai, Udaipur and Dubai.',
      rail: 'Jaipur Junction — excellent connectivity from Delhi (Jaipur Shatabdi, 4–5 hrs).',
      road: 'NH-52 and NH-21 via Sikar; regular AC buses and private cabs from Delhi and Sikar.',
    },
  },
  udaipur: {
    rating: 4.8,
    reviewCount: 356,
    idealDuration: '2–3 days',
    distanceFromSikar: '≈ 490 km (9 hrs by road)',
    howToReach: {
      air: 'Maharana Pratap Airport (UDR), Dabok — direct flights from Delhi, Mumbai and Jaipur.',
      rail: 'Udaipur City station — overnight trains from Delhi and Jaipur.',
      road: 'Via Jaipur–Udaipur highway (NH-48); AC cabs available from Sikar.',
    },
  },
  jaisalmer: {
    rating: 4.8,
    reviewCount: 289,
    idealDuration: '2 days',
    distanceFromSikar: '≈ 530 km (9.5 hrs by road)',
    howToReach: {
      air: 'Jaisalmer Airport — limited direct flights (seasonal) from Delhi and Jaipur.',
      rail: 'Jaisalmer station — direct overnight train from Delhi and Jodhpur.',
      road: 'Via Jodhpur on NH-112; cab can combine Jodhpur–Jaisalmer in one loop.',
    },
  },
  jodhpur: {
    rating: 4.7,
    reviewCount: 264,
    idealDuration: '1–2 days',
    distanceFromSikar: '≈ 300 km (5.5 hrs by road)',
    howToReach: {
      air: 'Jodhpur Airport (JDH) — direct flights from Delhi, Mumbai, Bengaluru and Hyderabad.',
      rail: 'Jodhpur Junction — major railhead with trains from Delhi, Jaipur and Mumbai.',
      road: 'Via NH-62 through Nagaur; good highway from Sikar and Jaipur.',
    },
  },
  delhi: {
    rating: 4.6,
    reviewCount: 421,
    idealDuration: '2–3 days',
    distanceFromSikar: '≈ 250 km (5 hrs by road)',
    howToReach: {
      air: 'Indira Gandhi International Airport (DEL) — connects to every major city and country.',
      rail: 'New Delhi / Delhi Junction — India\u2019s largest rail network hub.',
      road: 'NH-52 via Jhunjhunu or NH-48 via Jaipur; AC buses from Sikar daily.',
    },
  },
  goa: {
    rating: 4.8,
    reviewCount: 378,
    idealDuration: '3–4 days',
    distanceFromSikar: 'Flight recommended (Sikar → Delhi/ Jaipur → Goa)',
    howToReach: {
      air: 'Dabolim (GOI) and Mopa (GOX) airports — direct flights from Delhi, Mumbai and Bengaluru.',
      rail: 'Madgaon station — direct trains from Delhi (Rajdhani) and Mumbai.',
      road: '≈ 1,700 km from Sikar; cab or bus via Mumbai (Konkan route).',
    },
  },
  kashmir: {
    rating: 4.9,
    reviewCount: 342,
    idealDuration: '4–6 days',
    distanceFromSikar: 'Flight recommended (Sikar → Delhi → Srinagar)',
    howToReach: {
      air: 'Sheikh ul-Alam International Airport (SXR), Srinagar — direct flights from Delhi and Jammu.',
      rail: 'Jammu Tawi station + scenic taxi drive (Banihal tunnel) to Srinagar.',
      road: '≈ 1,100 km via Jammu–Srinagar National Highway (winter weather dependent).',
    },
  },
  himachal: {
    rating: 4.7,
    reviewCount: 305,
    idealDuration: '4–5 days',
    distanceFromSikar: '≈ 800 km via Delhi (Manali)',
    howToReach: {
      air: 'Kullu–Bhuntar (KUU) seasonal airport near Manali; Chandigarh airport is a reliable option.',
      rail: 'Chandigarh or Kalka (toy train to Shimla), then drive to Manali.',
      road: 'Via Delhi–Chandigarh–Kullu highway; the journey itself is part of the adventure.',
    },
  },
  dubai: {
    rating: 4.8,
    reviewCount: 267,
    idealDuration: '4–5 days',
    distanceFromSikar: 'Direct flight from Delhi (≈ 3.5 hrs)',
    howToReach: {
      air: 'Dubai International (DXB) — direct flights from Delhi and Jaipur; e-visa assistance included.',
      rail: 'Metro connects the airport to Downtown, Marina and Mall of the Emirates.',
      road: 'City rides by Metro, taxi and RTA bus; desert safaris operate from the city.',
    },
  },
  international: {
    rating: 4.9,
    reviewCount: 198,
    idealDuration: '5–10 days',
    distanceFromSikar: 'Varies by destination',
    howToReach: {
      air: 'We book all international flights from Delhi, Jaipur or your nearest hub.',
      rail: 'Local rail networks (Eurostar, JR, Eurail) arranged per destination.',
      road: 'Transfers, day tours and self-drive arranged by our local partners.',
    },
  },
}
