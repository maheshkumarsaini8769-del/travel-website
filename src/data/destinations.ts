import { destinationImages, destinationGalleries } from './images'

export type DestinationCategory = 'Rajasthan' | 'India' | 'International'

export interface DestinationItineraryDay {
  day: string
  title: string
  desc: string
}

export interface DestinationPlanningInfo {
  howToReach: string
  idealDuration: string
  estimatedBudget: string
  localTips: string[]
}

export interface DestinationFAQ {
  question: string
  answer: string
}

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
  approximateItinerary?: DestinationItineraryDay[]
  travelPlanningInfo?: DestinationPlanningInfo
  faqs?: DestinationFAQ[]
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
    approximateItinerary: [
      { day: 'Day 1', title: 'Amber Fort, Jal Mahal & Nahargarh Sunset', desc: 'Morning visit to the majestic hilltop Amber Fort and mirror palace (Sheesh Mahal). Photo stop at Jal Mahal on Man Sagar Lake. Sunset panoramic views of the entire Pink City from Nahargarh Fort ramparts.' },
      { day: 'Day 2', title: 'City Palace, Jantar Mantar & Hawa Mahal', desc: 'Explore the living royal residence at City Palace, marvel at the astronomical instruments at Jantar Mantar (UNESCO World Heritage), and photograph Hawa Mahal facade. Afternoon street shopping in Johari and Bapu Bazaars.' },
      { day: 'Day 3', title: 'Albert Hall Museum & Chokhi Dhani', desc: 'Indo-Saracenic architecture at Albert Hall Museum, serene visit to Birla Mandir, and an authentic evening cultural feast with Rajasthani dance and food at Chokhi Dhani.' },
    ],
    travelPlanningInfo: {
      howToReach: 'Jaipur is located just 120 km from Sikar (approx. 2 to 2.5 hours by road via NH52 expressway). Sunsky Tourism provides private door-to-door cab pickups from Sikar, or you can take regular express trains from Sikar Junction.',
      idealDuration: '2 to 3 Days',
      estimatedBudget: '₹4,500 – ₹9,000 per person including stay, private cab, and meals.',
      localTips: [
        'Visit Amber Fort between 8:00 AM and 10:00 AM to avoid the large mid-day tourist rush.',
        'Nahargarh Fort rooftop offers the most breathtaking sunset view over the Pink City.',
        'Savor hot Pyaaz Kachoris at Rawat and authentic kulhad lassi on MI Road.',
      ],
    },
    faqs: [
      {
        question: 'How far is Jaipur from Sikar and what is the best way to travel?',
        answer: 'Jaipur is approximately 120 km from Sikar. The fastest and most comfortable way is via Sunsky Tourism private AC cab, taking around 2 to 2.5 hours on the 4-lane NH52 highway.',
      },
      {
        question: 'Which are the must-visit forts and palaces in Jaipur?',
        answer: 'The essential trio includes Amber Fort (grand Rajput architecture), Jaigarh Fort (home to the Jaivana cannon), and Nahargarh Fort (sunset views). In the city center, City Palace and Hawa Mahal are top landmarks.',
      },
      {
        question: 'What is the best time of year to visit Jaipur?',
        answer: 'October to March is the ideal tourist season when weather is sunny and pleasantly cool (18°C–25°C), perfect for heritage walking tours and bazaar shopping.',
      },
    ],
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
    approximateItinerary: [
      { day: 'Day 1', title: 'Lake Pichola, Jag Mandir & Sunset Boat Cruise', desc: 'Arrive in Udaipur and check into your lakeside heritage stay. Afternoon boat cruise on Lake Pichola with stops at Jag Mandir island palace. Sunset tea at Ambrai Ghat overlooking the illuminated City Palace.' },
      { day: 'Day 2', title: 'City Palace Complex & Saheliyon Ki Bari', desc: 'Extensive exploration of the City Palace (courtyards, Mor Chowk, and vintage car collection). Visit Jagdish Temple and the tranquil royal fountain gardens of Saheliyon Ki Bari. Evening walk along Fateh Sagar Lake.' },
      { day: 'Day 3', title: 'Monsoon Palace & Bagore Ki Haveli', desc: 'Morning drive up to Sajjangarh (Monsoon Palace) for sweeping panoramic views of the lakes and Aravalli ranges. Evening folk dance and puppet show at Bagore Ki Haveli on Gangaur Ghat.' },
    ],
    travelPlanningInfo: {
      howToReach: 'Udaipur is ~420 km from Sikar. Sunsky Tourism arranges private AC sedan or Innova cabs directly from Sikar (approx. 7–8 hours via Ajmer-Bhilwara highway), or you can take overnight express trains from Jaipur/Ajmer.',
      idealDuration: '3 to 4 Days',
      estimatedBudget: '₹8,500 – ₹16,000 per person including lakeside stay, private car, and boat tickets.',
      localTips: [
        'Book the 4:30 PM boat ride from Rameshwar Ghat to catch golden hour lighting on Lake Pichola.',
        'Reserve lake-facing rooftop tables at restaurants around Hanuman Ghat in advance.',
        'Kumbhalgarh Fort (second longest wall in the world) is an easy 2-hour day trip from Udaipur.',
      ],
    },
    faqs: [
      {
        question: 'Why is Udaipur considered the most romantic destination in Rajasthan?',
        answer: 'With its serene freshwater lakes, floating marble palaces, candlelit lakeside ghats, and Aravalli mountain backdrops, Udaipur provides an unmatched royal romantic ambiance for couples and families alike.',
      },
      {
        question: 'How many days are recommended for Udaipur sightseeing?',
        answer: 'A 3-day and 2-night itinerary is ideal to comfortably explore the City Palace, enjoy two lake boat rides, visit the Monsoon Palace, and explore local shopping without feeling rushed.',
      },
      {
        question: 'Can Sunsky Tourism book lake-view hotels in Udaipur?',
        answer: 'Yes, we have direct contracted rates with vetted lakeside heritage havelis and luxury resorts offering authentic Lake Pichola and Fateh Sagar views.',
      },
    ],
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
    approximateItinerary: [
      { day: 'Day 1', title: 'Golden Fort, Havelis & Gadisar Lake', desc: 'Explore the living Jaisalmer Fort (Sonar Qila), marvel at the stone filigree of Patwon Ki Haveli and Nathmal Ki Haveli. Sunset walk around peaceful Gadisar Lake.' },
      { day: 'Day 2', title: 'Kuldhara Village & Sam Sand Dunes Camp', desc: 'Visit the abandoned 13th-century Brahmin village of Kuldhara. Arrive at Sam Sand Dunes for an exhilarating sunset camel safari or 4x4 dune bashing. Night stay in luxury Swiss tents with Rajasthani folk music, dance, and dinner.' },
      { day: 'Day 3', title: 'Tanot Mata Temple & Longewala War Memorial', desc: 'Morning visit to the historic Tanot Mata Temple near the Indo-Pak border and Longewala post (scene of the 1971 war), returning to Jaisalmer for departure.' },
    ],
    travelPlanningInfo: {
      howToReach: 'Jaisalmer is approx. 480 km from Sikar (approx. 7.5 to 8.5 hours via Bikaner & Pokhran). Sunsky Tourism organizes private door-to-door AC car rentals and planned road trips from Sikar.',
      idealDuration: '3 Days / 2 Nights',
      estimatedBudget: '₹7,500 – ₹14,000 per person including Swiss tent camp, camel safari, and private vehicle.',
      localTips: [
        'Camp stays are magical between October and February when desert nights are cool and skies are filled with stars.',
        'Carry a warm jacket as night temperatures in the desert drop sharply to 8°C–12°C in December and January.',
        'Book desert camps through verified agencies to guarantee attached clean western washrooms and proper hot water.',
      ],
    },
    faqs: [
      {
        question: 'What is included in the Sam sand dunes desert package?',
        answer: 'Our desert package includes sunset camel safari on the sand dunes, luxury Swiss tent accommodation with private bathroom, evening high tea, live Kalbelia folk dance and music performance around a campfire, authentic buffet dinner, and breakfast.',
      },
      {
        question: 'Is Jaisalmer Fort really a living fort?',
        answer: 'Yes, Jaisalmer Fort is one of the only living forts in the world, with roughly one-fourth of the old city population residing inside its sandstone ramparts.',
      },
      {
        question: 'Can Sunsky Tourism customize the Jaisalmer trip from Sikar?',
        answer: 'Yes, we provide doorstep pickup from Sikar in private Swift Dzire, Ertiga, or Innova Crysta with customized hotel and desert camp bookings.',
      },
    ],
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
    approximateItinerary: [
      { day: 'Day 1', title: 'Arrival & North Goa Beach Sunset', desc: 'Arrive at Goa Airport, transfer to resort. Relax on Calangute/Baga beach, enjoy water sports, and sunset seafood dinner at a beach shack.' },
      { day: 'Day 2', title: 'Historic Forts & Chapora Sunset', desc: 'Explore Fort Aguada lighthouse, Sinquerim beach, Chapora Fort, and an evening stroll around the vibrant flea markets of Anjuna.' },
      { day: 'Day 3', title: 'Old Goa Heritage & Mandovi River Cruise', desc: 'Visit UNESCO World Heritage churches (Basilica of Bom Jesus, Se Cathedral), Mangueshi Temple, and enjoy an evening sunset music cruise along the Mandovi River.' },
      { day: 'Day 4', title: 'South Goa Beaches & Dudhsagar Falls', desc: 'Excursion to the stunning Dudhsagar waterfalls through Mollem National Park, followed by leisure time at Palolem beach.' },
    ],
    travelPlanningInfo: {
      howToReach: 'Direct flights connect Jaipur International Airport (JAI) to Goa (Dabolim/Mopa). Sunsky Tourism organizes full flight + resort packages with private airport transfers from Sikar.',
      idealDuration: '4 to 5 Days',
      estimatedBudget: '₹14,000 – ₹25,000 per person including flights, resort stay with pool, and sightseeing cab.',
      localTips: [
        'November through February provides the sunniest beach weather and pleasant sea breezes.',
        'South Goa is peaceful and pristine for couples and families, while North Goa is ideal for lively beach activities.',
      ],
    },
    faqs: [
      {
        question: 'Which airport in Goa is closest to major resorts?',
        answer: 'North Goa resorts are closest to the new Manohar International Airport (Mopa / GOX, ~35 mins), while central and South Goa properties are easily accessible from Dabolim Airport (GOI).',
      },
      {
        question: 'Can Sunsky Tourism customize family and honeymoon packages for Goa?',
        answer: 'Yes, we bundle confirmed flights, pool resorts, airport pickup, candlelight dinners, and sightseeing cabs tailored for your family or honeymoon.',
      },
    ],
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
    approximateItinerary: [
      { day: 'Day 1', title: 'Srinagar Arrival & Dal Lake Shikara Cruise', desc: 'Airport pickup, check-in to a luxury cedarwood Dal Lake houseboat. Sunset Shikara ride visiting the floating gardens and Char Chinar.' },
      { day: 'Day 2', title: 'Gulmarg Meadow of Flowers & Gondola Ride', desc: 'Full-day excursion to Gulmarg. Ascend to Apharwat Peak on the world-famous Gulmarg Gondola for panoramic snow views and skiing/sledging.' },
      { day: 'Day 3', title: 'Pahalgam Valley of Shepherds', desc: 'Drive through saffron fields to Pahalgam. Explore Betaab Valley, Aru Valley, and Chandanwari along the sparkling Lidder River.' },
      { day: 'Day 4', title: 'Mughal Gardens & Local Handicrafts', desc: 'Tour Nishat Bagh, Shalimar Bagh, Chashme Shahi, and Shankaracharya Hill Temple. Shop for authentic Pashmina shawls, saffron, and dry fruits.' },
    ],
    travelPlanningInfo: {
      howToReach: 'Direct flights from Jaipur or Delhi to Srinagar Airport (SXR). Sunsky Tourism coordinates taxi transfers from Sikar to the airport, flight ticketing, and local Kashmir chauffeur service.',
      idealDuration: '5 to 6 Days',
      estimatedBudget: '₹22,000 – ₹38,000 per person including flights, hotels, houseboat, meals, and cab.',
      localTips: [
        'Pre-book Gulmarg Gondola Phase 1 and 2 tickets online well in advance during peak summer and winter seasons.',
        'Always carry light woolens in summer as evenings in Pahalgam and Gulmarg turn chilly.',
        'Spend at least one night on a traditional houseboat on Dal Lake or Nigeen Lake for an authentic experience.',
      ],
    },
    faqs: [
      {
        question: 'Is Kashmir safe for family vacations?',
        answer: 'Yes, millions of domestic and international tourists visit Srinagar, Gulmarg, and Pahalgam safely every year. Tourist areas are welcoming, peaceful, and well-managed.',
      },
      {
        question: 'When is the best time to see snow in Kashmir?',
        answer: 'Late December through February is the best window for heavy snow in Srinagar and Gulmarg. Snow activities in Gulmarg Phase 2 are often available up until April.',
      },
    ],
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
    approximateItinerary: [
      { day: 'Day 1', title: 'Arrival & Dubai Marina Dhow Cruise', desc: 'Airport greeting, transfer to 4-star central hotel. Evening luxury Dhow Cruise on Dubai Marina with international buffet dinner and Tanoura dance.' },
      { day: 'Day 2', title: 'City Tour, Dubai Mall & Burj Khalifa', desc: 'Half-day city tour (Dubai Frame, Palm Jumeirah, Burj Al Arab photo stop). Evening at Dubai Mall, watching Dubai Fountain show, and ascending Burj Khalifa 124th floor at sunset.' },
      { day: 'Day 3', title: 'Desert Safari Adventure with BBQ Dinner', desc: 'Morning leisure or Gold Souk shopping. Afternoon 4x4 red dune bashing in Lahbab desert, camel ride, sandboarding, belly dancing, and BBQ dinner show at desert camp.' },
      { day: 'Day 4', title: 'Miracle Garden & Museum of the Future', desc: 'Visit the world-record floral displays at Dubai Miracle Garden and explore the architectural wonder of the Museum of the Future.' },
    ],
    travelPlanningInfo: {
      howToReach: 'Direct 3.5-hour flights connect Jaipur International Airport (JAI) with Dubai (DXB) and Sharjah (SHJ). Sunsky Tourism arranges complete packages with flights, 30-day UAE visas, and hotels.',
      idealDuration: '4 to 5 Days',
      estimatedBudget: '₹45,000 – ₹65,000 per person including flights, 4-star stay, visa, and key attraction tickets.',
      localTips: [
        'November to March is the ideal season for outdoor sightseeing with pleasant temperatures (22°C–28°C).',
        'Book Burj Khalifa sunset slots (5:00 PM to 6:30 PM) in advance for the best view of the city transitioning into glittering lights.',
        'Use the air-conditioned Dubai Metro for budget-friendly city navigation.',
      ],
    },
    faqs: [
      {
        question: 'Does Sunsky Tourism process Dubai tourist visas in Sikar?',
        answer: 'Yes, we process express 30-day and 60-day UAE tourist visas from Sikar within 2 to 3 working days with simple passport scans.',
      },
      {
        question: 'Are direct flights available from Jaipur to Dubai?',
        answer: 'Yes, daily direct flights operate between Jaipur International Airport (JAI) and Dubai (DXB) / Sharjah (SHJ), making it very convenient for Shekhawati travelers.',
      },
    ],
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
