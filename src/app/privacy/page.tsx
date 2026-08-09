import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import { ctaImages } from '@/data/images'
import { contact } from '@/data/contact'

export const metadata: Metadata = {
  title: 'Privacy Policy | Sunsky Tourism',
  description:
    'How Sunsky Tourism collects, uses and protects your personal information when you plan or book travel with us.',
}

const sections = [
  {
    title: '1. What we collect',
    body: 'We collect only what we need to plan and confirm your trip — your name, phone number, email, travel dates, traveller count, destination preferences and any details you share in enquiries or bookings.',
  },
  {
    title: '2. How we use it',
    body: 'Your information is used to prepare quotes, confirm bookings, coordinate with hotels and transport partners, share trip documents and provide on-trip support. We never sell, rent or trade your personal information.',
  },
  {
    title: '3. What we share',
    body: 'Only the minimum necessary details are shared with our suppliers (hotels, cab operators, airlines, visa consultants) to complete your booking. Each supplier is bound by its own terms and confidentiality obligations.',
  },
  {
    title: '4. How we protect it',
    body: 'Enquiries and bookings are handled through our office communication channels with standard security practices. We do not store card or payment details on our website — payments are confirmed through direct banking channels.',
  },
  {
    title: '5. Your choices',
    body: `You can ask us at any time for a copy of the information we hold about you, request corrections, or ask us to delete your data after your trip is complete. Write to us at ${contact.email}.`,
  },
  {
    title: '6. Cookies & analytics',
    body: 'Our website may use basic analytics to understand which pages are useful to visitors. We do not use tracking cookies for advertising or profiling purposes.',
  },
  {
    title: '7. Updates',
    body: 'We may update this policy from time to time. The latest version always appears on this page, and significant changes will be communicated to our active travellers.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Your Privacy"
        title="Privacy Policy"
        description="Your details stay between you and us — simple as that."
        image={ctaImages.cinematic}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading align="left" eyebrow="Our Promise" title="We respect your data." className="mb-2" />
          <div className="mt-10 space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-white">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
