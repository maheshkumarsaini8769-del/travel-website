import type { Metadata } from 'next'
import LegalPage from '@/components/layout/LegalPage'
import { contact } from '@/data/contact'

export const metadata: Metadata = {
  title: 'Privacy Policy | Sunsky Tourism',
  description: `How ${contact.brand} collects, uses and protects your personal information.`,
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 2026"
      note="This policy is a template to be reviewed and finalised by Sunsky Tourism's management before publication. Nothing here is a substitute for professional legal advice."
      sections={[
        {
          heading: 'What we collect',
          text: 'When you contact us through this website, WhatsApp or phone, we may receive your name, phone number, email address and details of your travel plans (destinations, dates, number of travellers). We collect only the information needed to respond to your enquiry and prepare your trip.',
        },
        {
          heading: 'How we use your information',
          text: 'We use your details to answer enquiries, prepare and confirm travel plans, share quotations, and arrange bookings with hotels, transport and other travel partners. We do not sell or rent your personal information to anyone.',
        },
        {
          heading: 'WhatsApp and calls',
          text: 'Enquiries made via WhatsApp (a Meta platform) or phone are subject to those platforms\u2019 own privacy policies. Messages may be kept as records of our customer correspondence.',
        },
        {
          heading: 'Data storage and sharing',
          text: 'Your information stays within Sunsky Tourism and is shared only with the hotels, airlines, transport operators and other partners required to deliver your trip. We keep enquiry records only as long as needed for service and legal compliance.',
        },
        {
          heading: 'Your rights',
          text: `You may ask us at any time to view, correct or delete the personal information we hold about you by writing to ${contact.email} or calling ${contact.phones[0]} / ${contact.phones[1]}.`,
        },
        {
          heading: 'Cookies and analytics',
          text: 'This website may use basic cookies for essential functions. We do not currently use third-party advertising trackers.',
        },
      ]}
    />
  )
}
