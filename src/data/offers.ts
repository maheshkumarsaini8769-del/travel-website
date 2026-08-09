import { packageImages } from './images'

export interface Offer {
  id: string
  title: string
  code: string
  discount: number
  description: string
  terms: string
  validTill: string
  image: string
  featured?: boolean
}

export const offers: Offer[] = [
  {
    id: 'festive-sale',
    title: 'Festive Season Mega Sale',
    code: 'SUNSKY20',
    discount: 20,
    description:
      'Flat 20% off on all domestic packages — Rajasthan, Kashmir, Goa and Himachal. Book early for the wedding & festival season.',
    terms: 'Applicable on new bookings above ₹15,000 per person. Not valid with any other offer.',
    validTill: '31 October 2026',
    image: packageImages['rajasthan-heritage'],
    featured: true,
  },
  {
    id: 'honeymoon-special',
    title: 'Honeymoon Special — Free Room Upgrade',
    code: 'HONEYMOON10',
    discount: 10,
    description:
      '10% off plus a complimentary room upgrade and a candle-light dinner on Kashmir, Goa and Dubai honeymoon packages.',
    terms: 'Valid for married couples with valid wedding date. Upgrade subject to availability.',
    validTill: '31 March 2026',
    image: packageImages['kashmir-escape'],
  },
  {
    id: 'group-deal',
    title: 'Group of 8+? Pay for 7!',
    code: 'GROUPFREE',
    discount: 13,
    description:
      'Bring a group of 8 or more travellers and one person travels free on the same package — perfect for office groups and family reunions.',
    terms: 'Free seat on twin sharing. Bookings to be made together from the same group.',
    validTill: '31 December 2026',
    image: packageImages['himachal-adventure'],
  },
  {
    id: 'dubai-flash',
    title: 'Dubai Flash Sale — Land Only',
    code: 'DUBAI15',
    discount: 15,
    description:
      '15% off on the Dubai Experience package including Burj Khalifa tickets, desert safari and dhow cruise dinner.',
    terms: 'Limited seats per month. Early bird pricing valid till the month-end.',
    validTill: '30 September 2026',
    image: packageImages['dubai-experience'],
  },
  {
    id: 'student-tour',
    title: 'Student & Youth Tour Special',
    code: 'STUDENT12',
    discount: 12,
    description:
      '12% off for students and young travellers (age 18–27) on group trips — Goa, Himachal and Rajasthan circuits.',
    terms: 'Valid student ID or age proof required at booking.',
    validTill: '31 August 2026',
    image: packageImages['goa-holiday'],
  },
  {
    id: 'repeat-customer',
    title: 'Repeat Traveller Loyalty',
    code: 'WELCOMEBACK',
    discount: 8,
    description:
      '8% off for every returning Sunsky traveller — our way of saying thank you for trusting us again.',
    terms: 'Mention your previous booking reference while enquiring.',
    validTill: 'Ongoing',
    image: packageImages['rajasthan-heritage'],
  },
]

export const offerById = (id: string) => offers.find((o) => o.id === id)
