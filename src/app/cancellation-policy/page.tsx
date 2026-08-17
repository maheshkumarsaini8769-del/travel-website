import type { Metadata } from 'next'
import LegalPage from '@/components/layout/LegalPage'
import { contact } from '@/data/contact'

export const metadata: Metadata = {
  title: 'Cancellation Policy | Sunsky Tourism',
  description: `How cancellations and changes work for ${contact.brand} travel bookings.`,
  alternates: { canonical: '/cancellation-policy' },
}

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      title="Cancellation Policy"
      updated="August 2026"
      note="This document is a template to be reviewed and finalised by Sunsky Tourism's management before publication. The exact charges for your booking will always be confirmed in writing with your quotation."
      sections={[
        {
          heading: 'The short version',
          text: 'We keep cancellation policies as fair as possible: the closer to travel you cancel, the more you may lose — because hotels and airlines pass charges on to us. Where suppliers allow free cancellation, we pass that benefit to you.',
        },
        {
          heading: 'Typical cancellation charges',
          text: 'As a general indication: more than 30 days before travel — the advance is adjustable against a new date or refunded after deducting supplier charges; 15–30 days before travel — up to 25% of the package cost; 7–14 days before travel — up to 50%; within 7 days or no-show — up to 100%. Non-refundable airline tickets and peak-season hotel bookings follow their own rules.',
        },
        {
          heading: 'Changes to your booking',
          text: 'Date and name changes are handled on a best-effort basis. Where suppliers allow free changes, we will not charge you extra for our service.',
        },
        {
          heading: 'How to cancel',
          text: `Send us a message on WhatsApp (${contact.whatsappPrimary}) or call ${contact.phones[0]} / ${contact.phones[1]}. Written cancellation is effective from the time we receive it, and refunds are processed to the same method used for payment.`,
        },
      ]}
    />
  )
}
