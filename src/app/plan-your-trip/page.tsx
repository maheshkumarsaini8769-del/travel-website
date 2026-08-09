import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import TripPlanner from '@/components/trips/TripPlanner'
import { ctaImages } from '@/data/images'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { MessageSquareText, ClipboardCheck, CalendarCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Plan Your Trip | Sunsky Tourism',
  description:
    'Tell us your destination, dates and budget — our travel experts in Sikar craft a personalised itinerary and confirm it with you on WhatsApp. Free consultation.',
}

const steps = [
  {
    icon: MessageSquareText,
    title: 'Share your dream',
    text: 'Fill the form with your destination, dates, budget and interests — takes under 2 minutes.',
  },
  {
    icon: ClipboardCheck,
    title: 'We design the plan',
    text: 'A real travel expert crafts your itinerary with honest costs — no templates, no hidden fees.',
  },
  {
    icon: CalendarCheck,
    title: 'Confirm & relax',
    text: 'Review the plan on WhatsApp, tweak anything, then book with confidence.',
  },
]

export default function PlanYourTripPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom Trip Planner"
        title="Plan your perfect trip, together."
        description="Dream it, fill it, send it — a Sunsky travel expert designs your personalised itinerary with honest prices, and confirms it with you on WhatsApp."
        image={ctaImages.cinematic}
      />

      <section className="relative pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TripPlanner />
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid gap-5 sm:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.03] p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-500/10">
                    <step.icon className="h-5 w-5 text-orange-400" />
                  </span>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  )
}
