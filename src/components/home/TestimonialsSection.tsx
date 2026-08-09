'use client'

import { Star, Quote } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'

const testimonials = [
  {
    name: 'Rakesh Sharma',
    place: 'Jaipur Heritage Tour',
    text: 'Everything was arranged perfectly — hotels, cabs, even the desert camp. We did not have to think about a single detail.',
    rating: 5,
  },
  {
    name: 'Priya & Aman Mehta',
    place: 'Kashmir Honeymoon',
    text: 'The houseboat on Dal Lake and the Gulmarg gondola were the highlights. Sunsky handled our honeymoon with so much care.',
    rating: 5,
  },
  {
    name: 'Sunita Agarwal',
    place: 'Goa Family Trip',
    text: 'Travelling with kids is never easy, but this was the smoothest trip we have had. They even planned kid-friendly beach time.',
    rating: 5,
  },
  {
    name: 'Vikram Rathore',
    place: 'Dubai Experience',
    text: 'Flights, visa, hotel, desert safari — all done in one call. The pricing was clear and there were zero surprises.',
    rating: 5,
  },
  {
    name: 'Kavita Joshi',
    place: 'Rajasthan Group Tour',
    text: 'We were a group of 12 and they managed everything beautifully. The drivers were excellent and very professional.',
    rating: 5,
  },
  {
    name: 'Arjun Singh',
    place: 'Himachal Adventure',
    text: 'Booked on WhatsApp in five minutes. Best rates in town and the support team answered every call during the trip.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Traveller Stories"
          title="What a Sunsky trip feels like."
          description="Sample stories of the kind of travel we plan every day — verified reviews from real travellers will be published here as they come in."
        />
        <p className="mt-2 text-center text-xs font-medium text-slate-500">
          Names shown are illustrative. We never post invented reviews.
        </p>

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <SpotlightCard className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 hover:border-orange-400/25">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Sample
                    </span>
                    <Quote className="h-6 w-6 text-orange-500/40" />
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">“{t.text}”</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="mt-0.5 text-xs text-orange-400">{t.place}</p>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
