'use client'

import { ShieldCheck, HeartHandshake, BedDouble, Compass, CalendarCheck, Headset } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'

const features = [
  {
    icon: ShieldCheck,
    title: 'Trusted Travel Assistance',
    text: 'A local team you can actually reach, before and during your trip.',
  },
  {
    icon: HeartHandshake,
    title: 'Personalized Planning',
    text: 'Every itinerary shaped around your pace, preferences and budget.',
  },
  {
    icon: BedDouble,
    title: 'Comfortable Stays',
    text: 'Hotels, resorts, houseboats and camps — vetted for comfort and value.',
  },
  {
    icon: Compass,
    title: 'Experienced Guidance',
    text: 'Destination know-how that helps you see places properly, not just visit them.',
  },
  {
    icon: CalendarCheck,
    title: 'Hassle-Free Planning',
    text: 'Bookings, documents and timing handled so you never chase details.',
  },
  {
    icon: Headset,
    title: 'Travel Support',
    text: 'One message on WhatsApp keeps our support team with you on the road.',
  },
]

export default function WhySunsky() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Sunsky"
          title="Travel With Confidence."
          description="A travel agency that feels like a travel partner — transparent, personal and always reachable."
        />

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <StaggerItem key={f.title}>
                <SpotlightCard className="group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/25">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{f.text}</p>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
