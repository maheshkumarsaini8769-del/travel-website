import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import TrustBadges from '@/components/ui/TrustBadges'
import SectionHeading from '@/components/ui/SectionHeading'
import BookingForm from '@/components/booking/BookingForm'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { ctaImages } from '@/data/images'
import { ClipboardList, MapPinned, MessagesSquare, Wallet } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Booking Enquiry | Sunsky Tourism',
  description:
    'Plan your trip with Sunsky Tourism — share your destination, dates, travellers and budget, and get a personalised itinerary and quote on WhatsApp within hours.',
  alternates: { canonical: '/booking' },
}

const steps = [
  { icon: MapPinned, title: 'Tell us your idea', text: 'Destination, dates and traveller count — a rough idea is enough to start.' },
  { icon: ClipboardList, title: 'Get your itinerary', text: 'We send a day-wise plan with stays, transport and a clear quote — usually within hours.' },
  { icon: MessagesSquare, title: 'Confirm on WhatsApp', text: 'Approve the plan, pay a small advance, and everything is locked in.' },
  { icon: Wallet, title: 'Travel with support', text: '24×7 on-trip assistance — one message away through the whole journey.' },
]

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Plan My Trip"
        title="Tell us where you want to go."
        description="Fill in the short form — we'll come back on WhatsApp with a personalised itinerary, honest prices and no pressure."
        image={ctaImages.cinematic}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TrustBadges className="mb-14" />

          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <SectionHeading align="left" eyebrow="How it works" title="From idea to itinerary in four steps." className="mb-10" />
              <StaggerGroup className="space-y-5">
                {steps.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <StaggerItem key={s.title}>
                      <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-bold text-white">
                            <span className="mr-1.5 text-orange-400">{String(i + 1).padStart(2, '0')}.</span>
                            {s.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.text}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerGroup>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-10">
              <h2 className="text-2xl font-bold text-white">Trip enquiry form</h2>
              <p className="mt-2 text-sm text-slate-400">
                Submitting opens WhatsApp with your details pre-filled — hit send and we take it from there.
              </p>
              <div className="mt-8">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
