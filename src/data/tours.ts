import { destinationGalleries } from './images'

export type TourCategory =
  | 'Heritage'
  | 'Cultural'
  | 'Adventure'
  | 'Nature'
  | 'Water'
  | 'Family'
  | 'Food'

export interface TourItineraryItem {
  title: string
  time?: string
  text: string
}

export interface TourFaq {
  question: string
  answer: string
}

export interface Tour {
  id: string
  slug: string
  title: string
  destinationId: string
  destination: string
  category: TourCategory
  durationLabel: string
  hours: number
  tourType: 'Private' | 'Group' | 'Private or Group'
  language: string
  pickup: string
  groupSize: string
  priceLabel: string
  availability: string
  cancellation: string
  meetingPoint: string
  accessibility: string
  tagline: string
  description: string
  overview: string
  images: string[]
  highlights: string[]
  itinerary: TourItineraryItem[]
  inclusions: string[]
  exclusions: string[]
  bestFor: string[]
  whatToCarry: string[]
  faqs: TourFaq[]
}

export const tours: Tour[] = [
  {
    id: 'jaipur-heritage-walk',
    slug: 'jaipur-heritage-walk',
    title: 'Jaipur Heritage Walking Tour',
    destinationId: 'jaipur',
    destination: 'Jaipur',
    category: 'Heritage',
    durationLabel: '3 Hours',
    hours: 3,
    tourType: 'Private or Group',
    language: 'English, Hindi',
    pickup: 'Hotel pickup & drop included',
    groupSize: '2 – 12 travellers',
    priceLabel: 'Price on request',
    availability: 'Availability on request',
    cancellation: 'Free cancellation up to 48 hours before start',
    meetingPoint: 'Hotel lobby pickup or Hawa Mahal entrance',
    accessibility: 'Walking tour — comfortable footwear required',
    tagline: 'Walk the pink-walled lanes of the old city',
    description:
      'A guided 3-hour walk through the old city of Jaipur — from Hawa Mahal to the bazaars of Johari and Bapu, with stories, snacks and photo stops.',
    overview:
      'Step off the tourist trail and into the living lanes of Jaipur. This guided walk covers the iconic Hawa Mahal viewpoint, the 17th-century City Palace square, the Johari Bazaar jewellery lanes and the chaat corners of Bapu Bazaar. Your local storyteller shares the history behind the pink walls, and you finish with a hot masala chai at a family-run tea stall.',
    images: destinationGalleries.jaipur,
    highlights: ['Hawa Mahal viewpoint', 'City Palace square', 'Johari Bazaar', 'Bapu Bazaar chaat stop', 'Masala chai at a local stall'],
    itinerary: [
      {
        time: '08:30',
        title: 'Pickup & Intro',
        text: 'Hotel pickup in Jaipur, then a short drive to the start point near Hawa Mahal.',
      },
      {
        time: '09:00',
        title: 'Hawa Mahal & City Palace',
        text: 'Photo stops at Hawa Mahal, then a walk through the palace complex square and its history.',
      },
      {
        time: '10:00',
        title: 'Johari & Bapu Bazaars',
        text: 'Wander the jewellery and textile lanes, meet artisans, and sample local snacks.',
      },
      {
        time: '11:15',
        title: 'Chai Break & Wrap-up',
        text: 'Masala chai at a family-run stall, followed by a ride back to your hotel.',
      },
    ],
    inclusions: ['English/Hindi speaking guide', 'Hotel pickup & drop', 'Chai and light snack', 'All entry fees where applicable'],
    exclusions: ['Personal shopping and expenses', 'Tips for the guide (optional)'],
    bestFor: ['History lovers', 'Photographers', 'First-time visitors'],
    whatToCarry: ['Comfortable shoes', 'Hat and sunscreen', 'Water bottle'],
    faqs: [
      {
        question: 'Is this tour suitable for elderly travellers?',
        answer: 'Yes — the walk is mostly flat. We can adjust the pace and skip steps where needed.',
      },
      {
        question: 'Do we need entry tickets for the City Palace?',
        answer: 'We stop at the palace square and viewpoint from outside; entry tickets are only needed if you wish to enter, which we can arrange on request.',
      },
    ],
  },
  {
    id: 'udaipur-sunset-boat-ride',
    slug: 'udaipur-sunset-boat-ride',
    title: 'Udaipur Sunset Boat Ride',
    destinationId: 'udaipur',
    destination: 'Udaipur',
    category: 'Nature',
    durationLabel: '2 Hours',
    hours: 2,
    tourType: 'Private or Group',
    language: 'English, Hindi',
    pickup: 'Hotel pickup & drop included',
    groupSize: '2 – 20 travellers',
    priceLabel: 'Price on request',
    availability: 'Availability on request',
    cancellation: 'Free cancellation up to 24 hours before start',
    meetingPoint: 'Hotel pickup or Lal Ghat jetty',
    accessibility: 'Sit-down boat ride — suitable for all ages',
    tagline: 'Glide across Lake Pichola as the city turns gold',
    description:
      'A private sunset cruise on Lake Pichola past Jag Mandir and the Lake Palace, with the City Palace glowing amber behind you.',
    overview:
      'The most romantic hour in Udaipur happens on the water. Board a traditional boat at Lal Ghat and glide across Lake Pichola past the marble Lake Palace and the island of Jag Mandir, while the Aravalli hills frame a famous sunset. Small group, unhurried pace, and your guide narrates the legends of the lake on the way back.',
    images: destinationGalleries.udaipur,
    highlights: ['Lake Pichola sunset cruise', 'Views of Lake Palace & Jag Mandir', 'Live commentary on local legends', 'Golden-hour photography'],
    itinerary: [
      {
        time: '17:00',
        title: 'Pickup & Boarding',
        text: 'Hotel pickup and a short drive to the Lal Ghat jetty.',
      },
      {
        time: '17:30',
        title: 'Cruise the Lake',
        text: 'Sail past Jag Mandir and the Lake Palace with photo stops as the sun lowers.',
      },
      {
        time: '18:30',
        title: 'Return to Jetty',
        text: 'Glide back as the City Palace lights up, then drop back to your hotel.',
      },
    ],
    inclusions: ['Private boat ride on Lake Pichola', 'Guide on board', 'Hotel pickup & drop', 'Life jackets'],
    exclusions: ['Meals and drinks', 'Optional entry to Jag Mandir'],
    bestFor: ['Couples & honeymooners', 'Photographers', 'Families'],
    whatToCarry: ['Light jacket in winter', 'Camera', 'Phone for photos'],
    faqs: [
      {
        question: 'Can the boat be booked for a private group?',
        answer: 'Yes — we can arrange a completely private boat for groups and special occasions like proposals or anniversaries.',
      },
    ],
  },
  {
    id: 'jaisalmer-desert-safari',
    slug: 'jaisalmer-desert-safari',
    title: 'Jaisalmer Desert Safari & Camp Night',
    destinationId: 'jaisalmer',
    destination: 'Jaisalmer',
    category: 'Adventure',
    durationLabel: '1 Day',
    hours: 8,
    tourType: 'Private or Group',
    language: 'English, Hindi',
    pickup: 'Hotel pickup & drop included',
    groupSize: '1 – 24 travellers',
    priceLabel: 'Price on request',
    availability: 'Availability on request',
    cancellation: 'Free cancellation up to 72 hours before start',
    meetingPoint: 'Hotel lobby pickup',
    accessibility: 'Desert terrain — jeep seats for those who prefer not to ride camels',
    tagline: 'Camel safari, sand dunes and a night under the stars',
    description:
      'Ride a camel into the Sam dunes, watch the sunset over golden sand, and enjoy dinner, folk music and a bonfire at a desert camp.',
    overview:
      'The classic Thar experience, done properly. After a scenic drive to the Sam Sand Dunes, you cross the dunes on a gentle camel safari, watch the sunset from the tallest ridge, then settle into a comfortable desert camp for dinner, folk performances and a bonfire before returning to Jaisalmer by night.',
    images: [destinationGalleries.jaisalmer[0], destinationGalleries.jaisalmer[1], destinationGalleries.jaisalmer[2], destinationGalleries.jaisalmer[3]],
    highlights: ['Sunset at Sam Sand Dunes', 'Camel safari in the Thar', 'Rajasthani folk music & dance', 'Bonfire dinner', 'Stargazing'],
    itinerary: [
      {
        time: '15:30',
        title: 'Drive to Sam',
        text: 'Hotel pickup and a ~45 minute drive to the Sam Sand Dunes.',
      },
      {
        time: '16:30',
        title: 'Camel Safari',
        text: 'Gentle camel ride across the dunes, guided by local camelmen.',
      },
      {
        time: '18:00',
        title: 'Sunset at the Dunes',
        text: 'Climb the highest ridge and watch the sun sink into the sand.',
      },
      {
        time: '19:00',
        title: 'Camp Dinner & Folk Night',
        text: 'Buffet dinner, folk music and dance around the bonfire.',
      },
      {
        time: '21:30',
        title: 'Return to Jaisalmer',
        text: 'Drop back to your hotel in Jaisalmer.',
      },
    ],
    inclusions: ['Round-trip pickup & drop', 'Camel safari with camelmen', 'Sunset view point', 'Buffet dinner', 'Folk music & dance show', 'Bonfire (seasonal)'],
    exclusions: ['Alcoholic beverages', 'Extra camel ride time', 'Tips'],
    bestFor: ['Adventure seekers', 'Families', 'Photographers'],
    whatToCarry: ['Light jacket for evening', 'Sunscreen and cap', 'Comfortable closed shoes'],
    faqs: [
      {
        question: 'Can we stay overnight at the desert camp?',
        answer: 'Yes — an overnight stay with tents or a luxury Swiss camp can be arranged as an add-on.',
      },
      {
        question: 'Is the camel ride safe for children?',
        answer: 'Yes — the ride is gentle and slow. Children ride with an adult or with the camelman.',
      },
    ],
  },
  {
    id: 'goa-water-sports-day',
    slug: 'goa-water-sports-day',
    title: 'Goa Water Sports Day',
    destinationId: 'goa',
    destination: 'Goa',
    category: 'Water',
    durationLabel: 'Half Day',
    hours: 5,
    tourType: 'Group',
    language: 'English, Hindi, Marathi',
    pickup: 'Hotel pickup & drop included',
    groupSize: '1 – 30 travellers',
    priceLabel: 'Price on request',
    availability: 'Availability on request',
    cancellation: 'Free cancellation up to 48 hours before start',
    meetingPoint: 'Hotel lobby pickup',
    accessibility: 'Water activities — minimum age 5 years for banana rides',
    tagline: 'Banana boat, jet ski and more on Goan waters',
    description:
      'A fun half-day of beach sports — jet ski, banana boat ride, parasailing and speedboat surfing on Calangute or Baga waters.',
    overview:
      'A full-throttle morning on the beach. After hotel pickup, head to the Baga–Calangute stretch for a supervised session of jet skiing, banana boat rides, parasailing and bumper rides, with trained lifeguards and life jackets throughout. Photographers capture the fun, and you are back at your hotel by lunch.',
    images: destinationGalleries.goa,
    highlights: ['Jet ski ride', 'Banana boat', 'Parasailing', 'Speedboat bumper ride', 'Life jackets & lifeguards throughout'],
    itinerary: [
      {
        time: '08:00',
        title: 'Pickup & Briefing',
        text: 'Hotel pickup and a safety briefing at the beach water sports centre.',
      },
      {
        time: '09:00',
        title: 'Water Sports Session',
        text: 'Jet ski, banana boat and parasailing rounds with trained operators.',
      },
      {
        time: '11:30',
        title: 'Beach Time & Return',
        text: 'Shower at the centre, short beach break, then drop back to your hotel.',
      },
    ],
    inclusions: ['All water sports entry fees', 'Safety briefing and life jackets', 'Hotel pickup & drop', 'Changing room access'],
    exclusions: ['Personal shopping', 'Photography packages (optional, payable at centre)', 'Meals'],
    bestFor: ['Adventure seekers', 'Families with teens', 'Group outings'],
    whatToCarry: ['Swimwear and towel', 'Sunscreen', 'Dry clothes for the return'],
    faqs: [
      {
        question: 'Are life jackets provided?',
        answer: 'Yes — life jackets are mandatory and provided for every activity.',
      },
      {
        question: 'Is parasailing safe?',
        answer: 'Yes — parasailing is operated by licensed operators with trained spotters, and the harness is checked before each flight.',
      },
    ],
  },
  {
    id: 'kashmir-shikara-ride',
    slug: 'kashmir-shikara-ride',
    title: 'Dal Lake Shikara Ride',
    destinationId: 'kashmir',
    destination: 'Kashmir',
    category: 'Nature',
    durationLabel: '2 Hours',
    hours: 2,
    tourType: 'Private or Group',
    language: 'English, Hindi, Kashmiri',
    pickup: 'Near your Srinagar stay — walk to the ghat',
    groupSize: '1 – 8 travellers',
    priceLabel: 'Price on request',
    availability: 'Availability on request',
    cancellation: 'Free cancellation up to 24 hours before start',
    meetingPoint: 'Nearest shikara ghat to your hotel or houseboat',
    accessibility: 'Gentle seated ride — suitable for all ages',
    tagline: 'Glide through the floating gardens of Dal Lake',
    description:
      'A hand-carved shikara ride across Dal Lake through the floating gardens, past houseboats and the Zabarwan mountains.',
    overview:
      'No visit to Srinagar is complete without a shikara ride. Drift across Dal Lake in a hand-carved wooden boat, past colourful houseboats, floating vegetable gardens and the Char Chinar island, with the Zabarwan mountains rising behind. Best in the soft light of early morning or late afternoon, with or without a Kashmiri kahwa on board.',
    images: destinationGalleries.kashmir,
    highlights: ['Classic shikara ride', 'Floating gardens', 'Char Chinar island', 'Houseboat views', 'Kashmiri kahwa (optional)'],
    itinerary: [
      {
        time: '07:30',
        title: 'Meet at the Ghat',
        text: 'Meet your shikara walla at the ghat nearest to your stay.',
      },
      {
        time: '08:00',
        title: 'Ride Across the Lake',
        text: 'Glide past the floating gardens, houseboats and Char Chinar island.',
      },
      {
        time: '09:30',
        title: 'Return',
        text: 'Leisurely row back to the ghat with photo stops along the way.',
      },
    ],
    inclusions: ['Shikara ride for the group', 'Blankets for winter rides', 'Guide if requested'],
    exclusions: ['Kahwa and snacks (payable on board)', 'Tips'],
    bestFor: ['Couples & honeymooners', 'Families', 'Slow travellers'],
    whatToCarry: ['Light jacket', 'Camera', 'Cash for kahwa'],
    faqs: [
      {
        question: 'Is the ride possible in winter?',
        answer: 'Yes — rides run all year. Blankets and hot kahwa keep you cosy on cold mornings.',
      },
    ],
  },
  {
    id: 'dubai-desert-safari',
    slug: 'dubai-desert-safari',
    title: 'Dubai Desert Safari',
    destinationId: 'dubai',
    destination: 'Dubai',
    category: 'Adventure',
    durationLabel: 'Half Day',
    hours: 6,
    tourType: 'Group',
    language: 'English, Hindi, Arabic',
    pickup: 'Hotel pickup & drop included (Dubai city)',
    groupSize: '1 – 40 travellers',
    priceLabel: 'Price on request',
    availability: 'Availability on request',
    cancellation: 'Free cancellation up to 24 hours before start',
    meetingPoint: 'Hotel lobby pickup',
    accessibility: 'Dune bashing is optional — request a relaxed ride',
    tagline: 'Dune bashing, sunset and an Arabian camp night',
    description:
      'An evening in the Arabian desert — thrilling dune bashing, a sunset photo stop, and an international BBQ dinner with live shows at a desert camp.',
    overview:
      'The classic Dubai evening. After pickup, your driver-guide takes you into the red dunes for an exhilarating dune-bashing ride, followed by a sunset stop for photos and an optional short camel ride. At the desert camp you enjoy henna, shisha corners, live tanoura and belly dance shows, and a buffet BBQ dinner before the drive back to your hotel.',
    images: destinationGalleries.dubai,
    highlights: ['Dune bashing in a 4x4', 'Sunset photo stop', 'Short camel ride', 'BBQ buffet dinner', 'Tanoura & belly dance shows'],
    itinerary: [
      {
        time: '15:00',
        title: 'Pickup & Drive',
        text: 'Hotel pickup and a 45-minute drive to the desert.',
      },
      {
        time: '16:00',
        title: 'Dune Bashing',
        text: 'Thrilling 30-minute dune drive with safety briefing.',
      },
      {
        time: '16:45',
        title: 'Sunset Stop & Camel Ride',
        text: 'Photo stop at the dunes and a short camel ride.',
      },
      {
        time: '18:00',
        title: 'Desert Camp Evening',
        text: 'Henna, shows and a buffet BBQ dinner under the stars.',
      },
      {
        time: '20:30',
        title: 'Return to Hotel',
        text: 'Drop back to your Dubai hotel.',
      },
    ],
    inclusions: ['Hotel pickup & drop', '4x4 dune bashing', 'Camel ride', 'BBQ dinner with vegetarian options', 'Live shows', 'Soft drinks, water & tea'],
    exclusions: ['Alcohol (not included in standard safari)', 'Quad biking and sandboarding (optional add-ons)'],
    bestFor: ['Adventure seekers', 'Families', 'First-time visitors to Dubai'],
    whatToCarry: ['Sunscreen', 'Camera', 'Light clothing for the evening'],
    faqs: [
      {
        question: 'Can children join the dune bashing?',
        answer: 'Yes — children above 5 years can join. For younger children or anyone who prefers, we can request a smooth, relaxed ride.',
      },
      {
        question: 'Are vegetarian options available for dinner?',
        answer: 'Yes — the buffet includes vegetarian, Jain and halal options.',
      },
    ],
  },
]

export const tourCategories: TourCategory[] = ['Heritage', 'Cultural', 'Adventure', 'Nature', 'Water', 'Family', 'Food']

export function tourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug)
}

export const tourImages = (id: string) => {
  const tour = tours.find((t) => t.id === id)
  return tour ? tour.images : [destinationGalleries.jaipur[0]]
}
