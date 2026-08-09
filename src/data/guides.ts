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
]

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}

export const guideImage = (id: string) => {
  const guide = guides.find((g) => g.id === id)
  return guide ? guide.image : destinationImages.jaipur
}
