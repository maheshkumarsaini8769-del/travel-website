import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import TrustBadges from '@/components/ui/TrustBadges'
import ReviewForm from '@/components/reviews/ReviewForm'
import { ctaImages } from '@/data/images'
import { contact, waLink } from '@/data/contact'
import { MessageCircle, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Share Your Feedback | Sunsky Tourism',
  description:
    'Travelled with Sunsky Tourism? Share your review and rating — every genuine feedback helps other travellers plan a better trip.',
  alternates: { canonical: '/feedback' },
}

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Traveller Reviews"
        title="Share your experience."
        description="Travelled with us? Tell the world — your review helps other travellers choose with confidence."
        image={ctaImages.cinematic}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Feedback"
                title="We read every word."
                description="Good or bad, your feedback makes us better. Leave a rating and a few lines about your trip — hotels, cabs, planning, support, anything."
                className="lg:text-left"
              />
              <div className="mt-10 space-y-4">
                <a
                  href={waLink('Hello Sunsky Tourism, I would like to share feedback about my trip.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#25D366]/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">Prefer WhatsApp?</p>
                    <p className="text-xs text-slate-400">Send your feedback directly to our team.</p>
                  </div>
                </a>
                <a
                  href={`tel:+91${contact.phoneLinks[0]}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-orange-400/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{contact.phones[0]}</p>
                    <p className="text-xs text-slate-400">Call us — we are always happy to hear from you.</p>
                  </div>
                </a>
              </div>
              <TrustBadges className="mt-8" />
            </div>

            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  )
}