import { destinationImages } from './images'

export interface GuideSection {
  heading: string
  body: string
  list?: string[]
}

export interface Guide {
  id: string
  slug: string
  title: string
  category: string
  readTime: string
  date: string
  image: string
  excerpt: string
  intro: string
  sections: GuideSection[]
  tips: string[]
}

export const guides: Guide[] = [
  {
    id: 'best-time-to-visit-jaipur',
    slug: 'best-time-to-visit-jaipur',
    title: 'Best Time to Visit Jaipur',
    category: 'Destination Guide',
    readTime: '5 min read',
    date: 'August 2026',
    image: destinationImages.jaipur,
    excerpt: 'When to catch the Pink City at its best — weather, festivals and quieter seasons explained.',
    intro:
      'Jaipur shines in every season, but the best time to visit is October to March, when the desert sun is gentle and the city dresses up for its biggest festivals. Here is a season-by-season breakdown to help you pick your dates.',
    sections: [
      {
        heading: 'Winter (October – March) — Best time',
        body: 'Daytime temperatures sit between 15°C and 28°C — perfect for forts, bazaars and long walks through the old city. Mornings can be chilly (5–8°C in December–January), so pack a light jacket.',
        list: ['Diwali lights and markets (Oct–Nov)', 'Jaipur Literature Festival (Jan)', 'Elephant Festival in Jaipur (Feb–Mar)', 'Perfect for family and senior travellers'],
      },
      {
        heading: 'Summer (April – June) — Hot but quiet',
        body: 'Temperatures cross 40°C, but hotel rates drop sharply and palaces stay cool inside. Start sightseeing at 7 am, rest through midday, and you will have the forts almost to yourself.',
      },
      {
        heading: 'Monsoon (July – September) — Green Rajasthan',
        body: 'Short showers wash the dust away and the Aravalli hills turn green. Days are humid, but prices are lowest and the Kesar Kyari garden at Nahargarh looks stunning.',
      },
      {
        heading: 'Festivals not to miss',
        body: 'Holi in March turns Jaipur into a colour battlefield, and Diwali in October–November fills the bazaars with lanterns. Both are unforgettable — book early.',
      },
    ],
    tips: [
      'Weekdays are far quieter at Amber Fort than weekends.',
      'Sunrise visits to Hawa Mahal give the best photos with the least crowd.',
      'December–January mornings can be foggy — plan flights accordingly.',
    ],
  },
  {
    id: 'rajasthan-heritage-circuit',
    slug: 'rajasthan-heritage-circuit',
    title: 'The Classic Rajasthan Heritage Circuit',
    category: 'Itinerary Ideas',
    readTime: '7 min read',
    date: 'August 2026',
    image: destinationImages.jaisalmer,
    excerpt: 'Jaipur → Jodhpur → Jaisalmer → Udaipur in 6–7 days — a practical, honest day-by-day plan.',
    intro:
      'The golden triangle of Rajasthan — with Jaisalmer added for desert magic — is India at its most royal. Here is a realistic 6–7 day plan with driving times, because the distances between cities are the real schedule.',
    sections: [
      {
        heading: 'Day 1–2: Jaipur — the Pink City',
        body: 'Arrive, then spend a full day on Amber Fort, City Palace, Hawa Mahal and Jantar Mantar. Evening: Chokhi Dhani for a Rajasthani dinner experience.',
        list: ['Amber Fort: 2–3 hours (go early)', 'Hawa Mahal: 30 minutes at golden hour', 'Drive to next city: depart morning'],
      },
      {
        heading: 'Day 3: Jodhpur — the Blue City',
        body: 'Jaipur to Jodhpur is about 5–6 hours by road. Spend the afternoon at Mehrangarh Fort — one of India\u2019s most impressive — and walk the blue old town below.',
      },
      {
        heading: 'Day 4: Jaisalmer — the Golden City',
        body: 'Jodhpur to Jaisalmer is about 5 hours. The living fort, its carved havelis, and the Sam Sand Dunes at sunset make a compact, magical day.',
      },
      {
        heading: 'Day 5–6: Udaipur — the Lake City',
        body: 'Jaisalmer to Udaipur is the long one (8–9 hours) — fly or break it overnight in Jodhpur if possible. Reward yourself with the Lake Pichola sunset boat ride.',
      },
      {
        heading: 'Practical notes',
        body: 'A private car with driver is the most comfortable way to connect these cities. Trains work for Jaipur–Jodhpur and Jodhpur–Udaipur if you book early.',
      },
    ],
    tips: [
      'Book desert-camp nights only in October–March.',
      'Start the long drives by 7 am to avoid afternoon heat.',
      'A good travel agent (like us!) handles hotels, cars and permits in one message.',
    ],
  },
  {
    id: 'street-food-of-jaipur',
    slug: 'street-food-of-jaipur',
    title: 'Street Food of Jaipur — What to Eat',
    category: 'Food Guide',
    readTime: '4 min read',
    date: 'August 2026',
    image: destinationImages.jaipur,
    excerpt: 'Pyaaz kachori, ghewar, lassi and more — the old city bazaars decoded, dish by dish.',
    intro:
      'Jaipur\u2019s food story runs through its bazaars. Here is the honest, delicious shortlist — what to order, where to look for it, and how to eat like a local without a recipe book.',
    sections: [
      {
        heading: 'The famous bites',
        body: 'Start with pyaaz kachori (crisp, spiced onion pastries) from the morning stalls, then move on to ghewar — Jaipur\u2019s honey-soaked signature sweet, best during Teej.',
        list: ['Pyaaz kachori — breakfast staple', 'Ghewar — the city\u2019s pride', 'Pyaaz & mirchi vada — evening snacks', 'Filter lassi in clay kulhads'],
      },
      {
        heading: 'Where the bazaars lead',
        body: 'Johari Bazaar is famous for sweets and snacks, Bapu Bazaar for chaat corners, and the lanes near Tripolia Gate for lassi. If a stall is packed with locals, queue up.',
      },
      {
        heading: 'Dining etiquette',
        body: 'Carry small notes, drink only bottled or filtered water, and tell vendors about spice tolerance — most will happily adjust.',
      },
    ],
    tips: [
      'Eat street food in the morning or evening, never peak afternoon heat.',
      'Order ghewar fresh from the fryer at dawn if you can.',
      'Vegetarian? Jaipur is one of the easiest cities in the world for you.',
    ],
  },
  {
    id: 'kashmir-first-trip',
    slug: 'kashmir-first-trip',
    title: 'Kashmir for First-Timers',
    category: 'Destination Guide',
    readTime: '6 min read',
    date: 'August 2026',
    image: destinationImages.kashmir,
    excerpt: 'Shikaras, houseboats, pahalgam meadows and Gulmarg snow — a first-timer\u2019s calm, practical guide.',
    intro:
      'Srinagar\u2019s lakes, the meadows of Pahalgam and the snow slopes of Gulmarg make Kashmir the most beautiful corner of India. A few practical things make a first visit effortless.',
    sections: [
      {
        heading: 'The classic 4–5 day route',
        body: 'Base yourself in Srinagar: Day 1 — Dal Lake shikara ride and Old City; Day 2 — full-day Pahalgam; Day 3 — full-day Gulmarg (gondola ride); Day 4 — Mughal Gardens and shopping, then fly home.',
      },
      {
        heading: 'Houseboat or hotel?',
        body: 'A night on a Dal Lake houseboat is the Kashmir signature experience — try it for one night, then move to a comfortable hotel. Both can be arranged together.',
      },
      {
        heading: 'What to pack',
        body: 'Layers beat heavy coats: a warm fleece, waterproof shell, gloves and a scarf work across seasons. Summer is pleasant but evenings stay cool.',
      },
      {
        heading: 'Is it safe to travel?',
        body: 'Yes — the tourist zones of Srinagar, Gulmarg and Pahalgam see visitors year-round. Travelling through a registered local agency keeps transport, permits and sightseeing stress-free.',
      },
    ],
    tips: [
      'Book the Gulmarg gondola tickets in advance during peak season.',
      'December–February offers skiing and snow; April–June offers flower-filled meadows.',
      'Kashmir\u2019s dry fruits and Pashmina shawls are famous — shop from reputed government emporiums.',
    ],
  },
  {
    id: 'dubai-with-family',
    slug: 'dubai-with-family',
    title: 'Dubai with Family — What to Know',
    category: 'Family Travel',
    readTime: '5 min read',
    date: 'August 2026',
    image: destinationImages.dubai,
    excerpt: 'Desert safaris, aquariums, malls and desert heat — a parent\u2019s practical Dubai checklist.',
    intro:
      'Dubai is brilliantly built for families — but the heat, the distances and the price levels need a little planning. Here is what actually matters when travelling with kids.',
    sections: [
      {
        heading: 'When to go',
        body: 'November to March is the sweet spot — 20–28°C, perfect for outdoor pools and desert evenings. Summer (June–August) is hot (40°C+) but indoor attractions and hotel deals are excellent.',
      },
      {
        heading: 'What kids love most',
        body: 'The Dubai Aquarium, KidZania, IMG Worlds and Aquaventure Waterpark top most lists. The evening desert safari with BBQ dinner and shows is a family favourite too.',
      },
      {
        heading: 'Practical tips for parents',
        body: 'Book hotels with pool access, carry sunscreen and hats year-round, and remember: taxis and the metro are clean, safe and easy with prams. Most malls have family rooms and stroller rental.',
      },
      {
        heading: 'Budget honestly',
        body: 'Dubai is a premium destination. Prioritise one or two big attractions per day rather than cramming — half a day per attraction keeps everyone happy.',
      },
    ],
    tips: [
      'Visa help is where a travel agency earns its fee — process it well in advance.',
      'Freeze dates around school breaks early; December is the busiest month.',
      'Carry a refillable water bottle — free filtered water is widely available.',
    ],
  },
  {
    id: 'best-places-to-visit-in-rajasthan',
    slug: 'best-places-to-visit-in-rajasthan',
    title: '10 Best Places to Visit in Rajasthan — Royal Cities, Forts & Desert Safaris',
    category: 'Destination Guide',
    readTime: '7 min read',
    date: 'August 2026',
    image: destinationImages.jaipur,
    excerpt: 'From Jaipur’s pink palaces and Udaipur’s serene lakes to Jaisalmer’s golden sand dunes and Mount Abu’s hills — discover the top places to visit in Rajasthan with travel tips from local experts in Sikar.',
    intro:
      'Rajasthan is India’s premier heritage destination, uniting magnificent hill forts, royal palaces, shimmering desert dunes, and sacred pilgrimage towns. Whether planning a short weekend trip from Sikar or an extensive 10-day holiday circuit, here are the top places to experience across the Land of Kings.',
    sections: [
      {
        heading: '1. Jaipur — The Regal Pink City',
        body: 'As Rajasthan’s capital, Jaipur blends imperial history with vibrant modern bazaars. Amber Fort stands majestically atop the Aravalli hills, while the City Palace and Hawa Mahal showcase exquisite Rajput architecture.',
        list: [
          'Amber Fort: Morning elephant rides or jeep ascents and Sheesh Mahal mirror work',
          'Hawa Mahal & City Palace: Royal museum, armor galleries, and the famous honeycomb facade',
          'Nahargarh Fort: Stunning sunset panorama overlooking the entire illuminated city',
          'Johari & Bapu Bazaars: Authentic Jaipuri quilts, gemstones, blue pottery, and bandhani textiles',
        ],
      },
      {
        heading: '2. Udaipur — The Venice of the East',
        body: 'Surrounded by the Aravalli mountains and centered on Lake Pichola, Udaipur is Rajasthan’s most romantic destination. Whitewashed palaces reflect on clear waters, making sunset boat rides an unforgettable experience.',
        list: [
          'Lake Pichola: Scenic boat cruise past the Lake Palace and Jagmandir Island',
          'City Palace Complex: Rajasthan’s largest palace complex with courtyards and crystal galleries',
          'Saheliyon-ki-Bari & Bagore Ki Haveli: Royal fountain gardens and evening Dharohar folk dances',
        ],
      },
      {
        heading: '3. Jaisalmer — The Golden Desert Citadel',
        body: 'Rising out of the Thar Desert, Jaisalmer is constructed entirely from yellow sandstone that radiates a golden hue under the afternoon sun. Its centerpiece is Sonar Qila, one of the world’s very few living forts.',
        list: [
          'Jaisalmer Fort: Walk inside living ramparts inhabited by families, shops, and Jain temples',
          'Sam Sand Dunes: Camel safari, desert jeep dune bashing, and starlit cultural camp nights',
          'Patwon ki Haveli: Elaborately carved 5-storey sandstone merchant mansions',
        ],
      },
      {
        heading: '4. Jodhpur — The Sun City & Blue Haven',
        body: 'Dominated by the formidable Mehrangarh Fort perched on a 400-foot cliff, Jodhpur features a sea of indigo-blue painted houses in its old quarter, offering an authentic glimpse into Marwar traditions.',
        list: [
          'Mehrangarh Fort: One of India’s best-preserved forts with palanquins, royal cradles, and cannons',
          'Jaswant Thada: Intricately carved white marble cenotaph beside a tranquil lake',
          'Clock Tower & Sardar Market: Spice markets, handicraft stalls, and famous makhaniya lassi',
        ],
      },
      {
        heading: '5. Pushkar & Ajmer — Sacred Lakes & Sufi Dargah',
        body: 'Located just 3 hours from Sikar, Pushkar is famous for the sacred Brahma Temple and holy lake ghats, while neighboring Ajmer houses the venerated Khwaja Moinuddin Chishti Dargah.',
        list: [
          'Pushkar Lake & 52 Ghats: Evening maha aarti and serene desert reflections',
          'Brahma Temple: One of the world’s very few shrines dedicated to Lord Brahma',
          'Ajmer Sharif Dargah: Revered Sufi shrine visited by pilgrims of all faiths',
        ],
      },
      {
        heading: '6. Mount Abu & Ranthambore — Hills and Wildlife',
        body: 'For cool mountain breezes, Mount Abu is Rajasthan’s sole hill station with the famed 11th-century Dilwara Jain Temples. For wildlife enthusiasts, Ranthambore National Park in Sawai Madhopur offers India’s highest probability of spotting the Royal Bengal Tiger.',
      },
    ],
    tips: [
      'October through March provides the most pleasant weather for exploring forts and desert camps.',
      'Hiring a private AC cab with an experienced driver from Sikar makes multi-city circuits hassle-free.',
      'Carry modest clothing covering shoulders and knees when visiting temples and Sufi shrines.',
    ],
  },
  {
    id: 'rajasthan-trip-cost-from-sikar',
    slug: 'rajasthan-trip-cost-from-sikar',
    title: 'Rajasthan Trip Cost from Sikar — Honest Budget & Expense Breakdown (2026)',
    category: 'Budget Guide',
    readTime: '6 min read',
    date: 'August 2026',
    image: destinationImages.jaisalmer,
    excerpt: 'Planning a Rajasthan tour from Sikar? Here is an honest, itemized cost guide covering taxi fares, hotel categories, food, monument entry fees, and custom package rates.',
    intro:
      'Travelers in Sikar frequently ask: "How much does a Rajasthan holiday actually cost?" Because Sikar is situated in the Shekhawati region with direct highway access to Jaipur (115 km), Bikaner (220 km), and Jodhpur (290 km), road travel is both efficient and cost-effective. Here is a clear, transparent breakdown of real trip expenses.',
    sections: [
      {
        heading: '1. Overall Budget Ranges per Person per Day',
        body: 'Depending on your travel comfort, daily costs typically fall into one of three realistic brackets:',
        list: [
          'Budget / Backpacker: ₹1,500 – ₹2,500/day (Guest houses, sleeper trains/local buses, street dining)',
          'Comfortable Mid-Range: ₹3,500 – ₹5,500/day (3-star / boutique heritage hotels, private AC cab, fort guide)',
          'Luxury Heritage: ₹9,000 – ₹18,000+/day (4-5 star palace hotels, private chauffeur, luxury desert camps)',
        ],
      },
      {
        heading: '2. Private Taxi & Transportation Costs from Sikar',
        body: 'Hiring a dedicated vehicle with an experienced chauffeur remains the most flexible way to tour Rajasthan. Transparent rates from Sunsky Tourism in Sikar include fuel, driver allowance, and toll taxes:',
        list: [
          'Sedan (Swift Dzire / Etios): ₹11 – ₹13 per km (Ideal for couples and small families of up to 4)',
          'SUV (Ertiga / XL6): ₹14 – ₹16 per km (Extra luggage space and comfortable legroom)',
          'Premium MPV (Innova Crysta): ₹18 – ₹21 per km (Ultimate highway comfort for 6–7 passengers)',
          'Tempo Traveller (12–17 Seater): ₹25 – ₹30 per km (Perfect for extended family groups and pilgrimages)',
        ],
      },
      {
        heading: '3. Hotel & Accommodation Rates in Key Cities',
        body: 'Hotel rates vary significantly by season. In winter (October–February), expect peak pricing, while off-season summer discounts reach 40%:',
        list: [
          'Standard 3-Star Hotels (Jaipur, Jodhpur, Udaipur): ₹2,200 – ₹3,800 per night with breakfast',
          'Heritage Havelis & Boutique Stays: ₹3,500 – ₹6,500 per night',
          'Sam Sand Dunes Desert Camps (Jaisalmer): ₹3,500 – ₹7,000 per night (Includes Swiss tent, camel ride, folk music & buffet dinner)',
          'Luxury Palace Hotels: ₹12,000 – ₹35,000+ per night',
        ],
      },
      {
        heading: '4. Sightseeing Tickets & Monument Entry Fees',
        body: 'Indian citizens pay nominal entry fees at most state-managed monuments (₹50 to ₹100 per fort). Foreign travelers pay ₹300 to ₹600. In Jaipur, a composite 2-day entry ticket covering Amber Fort, Hawa Mahal, Jantar Mantar, and Albert Hall costs ₹300 for Indian nationals.',
      },
      {
        heading: '5. Complete 5-Day Sample Tour Package from Sikar',
        body: 'A popular 5-Day / 4-Night Jaipur + Jodhpur + Jaisalmer tour for a family of 4 travelling by private AC sedan typically costs between ₹32,000 and ₹46,000 total (₹8,000–₹11,500 per person), inclusive of private cab, 3-star hotels, daily breakfast, and desert camp stay.',
      },
    ],
    tips: [
      'Booking your entire itinerary as a single package with Sunsky Tourism saves 15–20% compared to booking individual cabs and hotels separately.',
      'Check if highway toll charges, state entry taxes, and driver night allowances are included upfront to avoid surprise bills.',
      'Carry cash or UPI on your phone — virtually all monument ticket counters and food stalls accept UPI across Rajasthan.',
    ],
  },
  {
    id: 'best-time-to-visit-rajasthan',
    slug: 'best-time-to-visit-rajasthan',
    title: 'Best Time to Visit Rajasthan — Month-by-Month Weather, Festivals & Tips',
    category: 'Travel Planning',
    readTime: '6 min read',
    date: 'August 2026',
    image: destinationImages.jaipur,
    excerpt: 'Find the ideal season for your Rajasthan holiday. Compare pleasant winter months (October–March), budget monsoon getaways, and off-season summer palace rates.',
    intro:
      'Because Rajasthan spans the arid Thar Desert, the rugged Aravalli range, and fertile eastern plains, weather conditions vary considerably throughout the year. Choosing the right month ensures comfortable sightseeing, vibrant festival participation, and optimal budget value.',
    sections: [
      {
        heading: 'Winter (October to March) — The Golden Season',
        body: 'Winter is universally considered the best time to visit Rajasthan. Daytime temperatures hover between 15°C and 27°C, accompanied by clear blue skies and refreshing breezes — ideal for strolling vast fort courtyards and desert dunes.',
        list: [
          'October – November: Pleasant post-monsoon freshness, Diwali celebrations, and the Pushkar Camel Fair',
          'December – January: Peak tourist season with cool evenings (5°C–10°C). Perfect for desert camping and bonfires',
          'February – March: Gentle sunshine, Jaisalmer Desert Festival, and colorful Holi celebrations',
        ],
      },
      {
        heading: 'Monsoon (July to September) — The Romantic Green Oasis',
        body: 'While desert areas like Jaisalmer receive sparse rainfall, southern and eastern Rajasthan (Udaipur, Mount Abu, Kumbhalgarh, and Bundi) transform into lush green havens with rushing waterfalls and overflowing lakes.',
        list: [
          'Lakes in Udaipur reach full capacity with stunning mountain cloudscapes',
          'Hotel and resort tariffs drop by 30% to 50% compared to winter rates',
          'Ideal for couples and travelers seeking quiet, unhurried heritage getaways',
        ],
      },
      {
        heading: 'Summer (April to June) — Budget-Friendly & Uncrowded',
        body: 'Temperatures in summer can exceed 40°C during peak afternoons. However, for travelers seeking luxury heritage palace resorts with private swimming pools at a fraction of their winter price, early morning and evening sightseeing remains viable.',
      },
      {
        heading: 'Major Cultural Festivals to Calendar',
        body: 'Timing your visit with Rajasthan’s world-renowned fairs creates lifetime memories: Pushkar Fair (October/November), Jaisalmer Desert Festival (February), Jaipur Literature Festival (January), and Udaipur Mewar Festival (March/April).',
      },
    ],
    tips: [
      'Pack warm layers, jackets, and shawls for December and January, as desert nights turn quite cold.',
      'Book heritage hotels and desert tents at least 4 to 6 weeks in advance for travel between November and January.',
      'Sunsky Tourism offers special pre-season discounts for tours booked before October.',
    ],
  },
  {
    id: 'jaipur-3-day-travel-itinerary',
    slug: 'jaipur-3-day-travel-itinerary',
    title: 'Jaipur 3-Day Travel Itinerary — The Complete Pink City Guide',
    category: 'Itinerary Ideas',
    readTime: '7 min read',
    date: 'August 2026',
    image: destinationImages.jaipur,
    excerpt: 'How to spend 3 perfect days in Jaipur from Sikar. Day-by-day plan covering Amber Fort, City Palace, Nahargarh sunset, bazaar shopping, and local Rajasthani food.',
    intro:
      'Located just 115 km southeast of Sikar along the smooth NH52 highway, Jaipur is an effortless weekend getaway or the starting point of an extended Rajasthan vacation. Here is a curated 3-day itinerary tested by local travel planners to maximize your time without rushing.',
    sections: [
      {
        heading: 'Day 1: Fortresses of Amer & The Royal Sunset',
        body: 'Dedicate your first day to the historic Aravalli ridge north of Jaipur.',
        list: [
          '8:30 AM — Amber Fort (Amer): Arrive early to marvel at the Sheesh Mahal (Hall of Mirrors), Diwan-i-Aam, and elephant pathways',
          '11:30 AM — Panna Meena Kund: The ancient symmetrical stepwell located right behind Amber Fort',
          '1:00 PM — Jal Mahal: Quick photo stop along the Man Sagar Lake walkway',
          '4:30 PM — Nahargarh Fort: Savor panoramic sunset views of the Pink City spread beneath the fort ramparts with tea at Padao Cafe',
        ],
      },
      {
        heading: 'Day 2: The Heart of the Walled City',
        body: 'Step inside the UNESCO World Heritage walled city to explore grand architecture and vibrant shopping lanes.',
        list: [
          '7:30 AM — Hawa Mahal (Palace of Winds): Golden-hour photography of the 953 ornate windows from the street or opposite Wind View Cafe',
          '9:30 AM — City Palace: The royal residence of the Maharaja, showcasing textile museums, antique carriages, and the famous Peacock Gate',
          '11:30 AM — Jantar Mantar: The UNESCO astronomical observatory containing the world’s largest stone sundial',
          '3:00 PM — Bazaars: Explore Johari Bazaar for jewellery and Bapu Bazaar for Mojaris, block-print bedsheets, and bandhani sarees',
        ],
      },
      {
        heading: 'Day 3: Art, Spirituality & Cultural Feast',
        body: 'Wrap up your Pink City adventure with modern icons and authentic cuisine.',
        list: [
          '9:00 AM — Albert Hall Museum: Indo-Saracenic architectural masterpiece in Ram Niwas Garden with historic artefacts and Egyptian mummy',
          '11:00 AM — Patrika Gate & Jawahar Circle: The viral pastel archway showcasing hand-painted murals of Rajasthan’s heritage',
          '1:00 PM — Authentic Lunch: Relish traditional dal baati churma at LMB or Rawat Mishthan Bhandar for famous pyaaz kachoris',
          'Evening — Chokhi Dhani: Live puppet shows, folk dancing, camel rides, and traditional thali dinner',
        ],
      },
      {
        heading: 'Reaching Jaipur from Sikar',
        body: 'By private AC taxi booked through Sunsky Tourism, the 115 km journey via NH52 takes approximately 2 to 2.5 hours door-to-door, offering convenient pickup directly from your home in Sikar.',
      },
    ],
    tips: [
      'Purchase the Composite Entry Ticket at your first monument to skip ticket queues at subsequent sites.',
      'Wear slip-on shoes or comfortable walking sneakers, as fort visits involve extensive walking over stone ramps.',
      'Carry cash or keep UPI enabled on your phone for market purchases and street food stalls.',
    ],
  },
  {
    id: 'jaisalmer-trip-guide',
    slug: 'jaisalmer-trip-guide',
    title: 'Jaisalmer Trip Guide — Living Fort, Thar Desert Camping & Havelis',
    category: 'Destination Guide',
    readTime: '7 min read',
    date: 'August 2026',
    image: destinationImages.jaisalmer,
    excerpt: 'Plan your dream golden city getaway. Comprehensive guide to Jaisalmer Fort, Sam Sand Dunes desert camping, camel safaris, intricately carved havelis, and reaching from Sikar.',
    intro:
      'Known as the Golden City, Jaisalmer sits deep in the heart of the Great Indian Desert. With its fairytale living sandstone fortress, shifting desert dunes, and carved merchant havelis, it feels like stepping straight into Arabian Nights. Here is everything you need to plan an extraordinary trip.',
    sections: [
      {
        heading: '1. Sonar Qila (Jaisalmer Fort) — The Living Wonder',
        body: 'Unlike most monuments in India that are museum preserves, Jaisalmer Fort is home to roughly 4,000 residents whose ancestors served the royal court. Wandering through its narrow cobblestone alleys reveals medieval houses, handicraft shops, rooftop cafes with panoramic desert views, and seven exquisite 12th-century Jain temples.',
      },
      {
        heading: '2. The Sam Sand Dunes & Desert Camping Experience',
        body: 'Located 40 km west of Jaisalmer city, Sam Sand Dunes features massive rippling dunes up to 30 meters high. A classic evening desert package includes:',
        list: [
          'Late afternoon 4x4 Jeep Dune Bashing and sunset camel trek',
          'Traditional welcome at the desert camp with dholak and tilak ceremony',
          'Live Kalbelia dance, Chari dance, and folk vocalists beside an open bonfire',
          'Authentic Rajasthani buffet dinner followed by overnight stay in luxury Swiss tents',
          'Stargazing under clear desert skies with minimal light pollution',
        ],
      },
      {
        heading: '3. Architectural Masterpieces — The Grand Havelis',
        body: 'During the 18th and 19th centuries, wealthy Jain and Marwari merchants built ostentatious stone residences with intricate latticework jharokhas. The 5-mansion complex of Patwon ki Haveli, Salim Singh ki Haveli with its peacock roofline, and Nathmal ki Haveli carved by two competitive brothers are mandatory stops.',
      },
      {
        heading: '4. The Mystery of Kuldhara Abandoned Village',
        body: 'En route to the sand dunes lies Kuldhara, a 13th-century village abruptly abandoned overnight by the Paliwal Brahmins in 1825 to protect their honor from an oppressive prime minister. Walking through the eerie, roofless stone ruins provides a fascinating historical pause.',
      },
      {
        heading: '5. How to Reach Jaisalmer from Sikar',
        body: 'The road distance from Sikar to Jaisalmer is approximately 460 km via Bikaner and Phalodi. By private AC cab, the drive takes 8 to 9 hours with smooth highway conditions. Alternatively, travelers can board the overnight express train from Bikaner or Jaipur.',
      },
    ],
    tips: [
      'Avoid unauthorized roadside touts when booking desert camps; always book through a trusted travel agency to ensure clean bedding, hot water, and authentic cultural performances.',
      'November to February is the prime season; desert temperatures can drop to 6°C at night, so carry heavy woollens.',
      'Wake up early for sunrise over Gadisar Lake to capture migratory birds and golden reflections.',
    ],
  },
  {
    id: 'kashmir-trip-planning-guide',
    slug: 'kashmir-trip-planning-guide',
    title: 'Kashmir Trip Planning Guide — Srinagar, Gulmarg, Pahalgam & Houseboats',
    category: 'Destination Guide',
    readTime: '8 min read',
    date: 'August 2026',
    image: destinationImages.kashmir,
    excerpt: 'Complete Kashmir holiday planning guide for families and couples from Rajasthan: Dal Lake houseboats, Gulmarg Gondola Phase 1 & 2, Pahalgam valleys, budgeting, and best seasons.',
    intro:
      'Renowned as "Paradise on Earth", Kashmir offers snow-capped Himalayan peaks, emerald pine valleys, crystal rivers, and historic houseboats. For travelers from Sikar and Rajasthan seeking an escape from desert heat, here is your definitive master guide to planning a Kashmir holiday.',
    sections: [
      {
        heading: '1. Srinagar — Shikaras, Mughal Gardens & Heritage',
        body: 'Srinagar is the natural gateway and cultural heart of the valley. Key highlights include:',
        list: [
          'Dal Lake & Nigeen Lake: 1-hour sunset shikara ride visiting floating vegetable markets and char chinar',
          'Overnight Houseboat Stay: Hand-carved cedar wood houseboats with traditional Kashmiri hospitality',
          'Mughal Gardens: Terraced lawns of Shalimar Bagh, Nishat Bagh, and the seasonal Indira Gandhi Tulip Garden (April)',
          'Shankaracharya Hill Temple: Ancient stone temple perched 1,000 feet above the valley offering panoramic views',
        ],
      },
      {
        heading: '2. Gulmarg — The Meadow of Flowers & Snow Sports',
        body: 'Located 50 km from Srinagar at 8,690 feet, Gulmarg is home to the world’s second-highest cable car (Gulmarg Gondola). Phase 1 takes you to Kongdoori meadow, while Phase 2 ascends to Apharwat Peak at 13,780 feet where snow can be found even into early summer.',
      },
      {
        heading: '3. Pahalgam — Valley of Shepherds & Pine Trails',
        body: 'Nestled along the pristine Lidder River, Pahalgam serves as the base for trout fishing, scenic horse riding to Baisaran (Mini Switzerland), and excursions to Betaab Valley (named after the Bollywood movie) and Chandanwari.',
      },
      {
        heading: '4. Suggested 5 Nights / 6 Days Itinerary',
        body: 'Day 1: Arrive in Srinagar, Dal Lake Shikara ride, overnight in Dal Lake houseboat. Day 2: Srinagar to Gulmarg day excursion (Gondola ride), overnight in Srinagar hotel. Day 3: Drive to Pahalgam, visit Apple orchards and Betaab Valley, overnight in Pahalgam. Day 4: Explore Aru Valley and Baisaran, return to Srinagar. Day 5: Srinagar local sightseeing (Mughal Gardens, Old City bazaar shopping for Pashmina and saffron). Day 6: Departure.',
      },
      {
        heading: '5. Travel Route from Sikar & Rajasthan',
        body: 'The most convenient route is a direct flight from Jaipur International Airport (JAI) or New Delhi (DEL) to Srinagar Sheikh ul-Alam International Airport (SXR), which takes roughly 1.5 to 2 hours flight time. Sunsky Tourism arranges complete door-to-door coordination including airport taxi transfers from Sikar.',
      },
    ],
    tips: [
      'Gondola Phase 2 tickets MUST be booked online 3–4 weeks in advance via the official portal; offline tickets are strictly unavailable.',
      'Only postpaid mobile SIM cards (Jio, Airtel, BSNL) work in Jammu & Kashmir; prepaid SIMs from other states do not receive signals due to security regulations.',
      'Buy saffron, walnuts, and dry fruits from authorized government emporiums or verified shops to guarantee authenticity.',
    ],
  },
  {
    id: 'dubai-trip-cost-from-india',
    slug: 'dubai-trip-cost-from-india',
    title: 'Dubai Trip Cost from India — Complete Budget Breakdown (2026 Guide)',
    category: 'Budget Guide',
    readTime: '7 min read',
    date: 'August 2026',
    image: destinationImages.dubai,
    excerpt: 'How much does a 5-day Dubai trip cost from India? Detailed cost breakdown covering tourist visa, direct flights, hotel bookings, Burj Khalifa tickets, desert safaris, and food.',
    intro:
      'Dubai is the number one international holiday choice for Indian families, couples, and shopping enthusiasts. With world-class architecture, futuristic theme parks, pristine beaches, and luxury shopping, knowing realistic costs helps you plan without unexpected financial surprises. Here is an honest, itemized expense guide.',
    sections: [
      {
        heading: '1. Estimated Total Cost per Person (5 Days / 4 Nights)',
        body: 'Depending on your preferred style of travel, here is what a 5-day Dubai vacation generally costs from India:',
        list: [
          'Budget Trip: ₹42,000 – ₹55,000 per person (3-star hotel in Deira/Bur Dubai, metro travel, select key attractions)',
          'Comfortable Family / Couple Package: ₹65,000 – ₹85,000 per person (4-star hotel, private airport transfers, desert safari, Burj Khalifa, Marina dhow cruise)',
          'Luxury Experience: ₹1,20,000 – ₹2,000,000+ per person (5-star Palm Jumeirah or Downtown hotel, private chauffeur, premium dining)',
        ],
      },
      {
        heading: '2. Tourist Visa Costs & Documentation',
        body: 'A standard 30-Day Single Entry Dubai Tourist Visa typically costs between ₹6,500 and ₹7,500 per applicant, including mandatory COVID/medical insurance. Sunsky Tourism provides express visa processing with only passport copy and white-background photograph required.',
      },
      {
        heading: '3. Return Flight Fares from Jaipur / Delhi',
        body: 'Direct flights from Jaipur (JAI) or Delhi (DEL) to Dubai (DXB) or Sharjah (SHJ) on airlines such as Air India Express, SpiceJet, IndiGo, or Emirates range from ₹18,000 to ₹28,000 return per person when booked 4 to 6 weeks in advance.',
      },
      {
        heading: '4. Hotel Accommodation Rates',
        body: 'Average nightly rates across Dubai neighborhoods:',
        list: [
          'Deira & Bur Dubai (Historic, budget-friendly, Indian dining): ₹3,500 – ₹5,500 per room/night',
          'Al Barsha & Business Bay (Central, modern, close to Mall of the Emirates): ₹5,500 – ₹9,000 per room/night',
          'Dubai Marina & Downtown (Walk to Dubai Mall & beach): ₹10,000 – ₹22,000 per room/night',
        ],
      },
      {
        heading: '5. Key Attraction Ticket Costs',
        body: 'Must-visit attractions and approximate ticket prices per person:',
        list: [
          'Burj Khalifa (124th & 125th Floor Observatory): ~₹3,500 – ₹4,200',
          'Desert Safari with 4x4 Dune Bashing, Camel Ride & BBQ Dinner: ~₹2,200 – ₹3,200',
          'Dubai Marina Luxury Dhow Cruise with International Dinner: ~₹1,800 – ₹2,500',
          'Museum of the Future: ~₹3,400',
          'Dubai Aquarium & Underwater Zoo: ~₹2,600',
        ],
      },
      {
        heading: '6. All-Inclusive Packages with Sunsky Tourism',
        body: 'Sunsky Tourism offers customized Dubai holiday packages starting from ₹58,000 per person, bundling return flights, 4-star hotel stay with breakfast, tourist visa, airport transfers, desert safari, Burj Khalifa entry, and Marina dhow cruise — planned right here in Sikar.',
      },
    ],
    tips: [
      'Carry a zero-forex markup debit/credit card to save 3.5% to 5% on currency exchange fees at Dubai merchant stores.',
      'Purchase a Silver Nol Card for convenient, ultra-clean Dubai Metro and bus transportation between downtown and marina.',
      'Keep digital and printed copies of your passport, visa grant letter, hotel voucher, and return flight ticket handy for immigration.',
    ],
  },
]

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}

export const guideImage = (id: string) => {
  const guide = guides.find((g) => g.id === id)
  return guide ? guide.image : destinationImages.jaipur
}
