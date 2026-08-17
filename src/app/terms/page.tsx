import type { Metadata } from 'next'
import LegalPage from '@/components/layout/LegalPage'
import { contact } from '@/data/contact'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sunsky Tourism',
  description: `Terms of service for ${contact.brand} — bookings, payments, changes and travel documents.`,
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="August 2026"
      note="This document is a template to be reviewed and finalised by Sunsky Tourism's management before publication. Nothing here is a substitute for professional legal advice."
      sections={[
        {
          heading: 'About these terms',
          text: `These terms apply to travel services booked through ${contact.brand}, a travel agency based in Sikar, Rajasthan. By requesting or confirming a booking with us, you accept these terms along with the terms of the service providers (hotels, airlines, transport operators) involved in your trip.`,
        },
        {
          heading: 'Quotations and prices',
          text: 'Quotations are prepared on request and may depend on availability, season and exchange rates. Prices shown as "on request" are confirmed in writing before booking. No booking is confirmed until we confirm it in writing (WhatsApp, email or signed form).',
        },
        {
          heading: 'Payments and cancellation',
          text: 'Bookings may require an advance or full payment as confirmed in your quotation. Cancellation policies vary by supplier; any applicable cancellation charges will be explained before you confirm the booking. Requests to change dates or names are handled on a best-effort basis and may attract supplier charges.',
        },
        {
          heading: 'Travel documents and health',
          text: 'You are responsible for carrying valid identity documents, passports, visas and any required travel permits, and for meeting health requirements (e.g. vaccinations) of your destination. We assist with documentation but do not guarantee entry into any country.',
        },
        {
          heading: 'Our responsibility',
          text: 'We act as an organiser between you and the hotels, airlines and transport operators. We carefully choose our partners, but we are not responsible for events beyond reasonable control — including weather, strikes, flight delays, political events or natural disasters — or for the actions of third-party service providers.',
        },
        {
          heading: 'Complaints',
          text: `If anything goes wrong during your trip, tell us immediately and we will do our best to put it right on the spot. Unresolved issues may be raised in writing to ${contact.email} or ${contact.phones[0]} / ${contact.phones[1]}.`,
        },
      ]}
    />
  )
}
