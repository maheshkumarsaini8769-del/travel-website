'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { MapPinned, SlidersHorizontal, ClipboardCheck, PartyPopper } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'

const steps = [
  {
    icon: MapPinned,
    title: 'Choose Destination',
    text: 'Browse our destinations and pick the place that calls to you — or tell us your dream and we will find it.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Customize Your Trip',
    text: 'Share your dates, budget and style. We shape a draft itinerary around exactly how you love to travel.',
  },
  {
    icon: ClipboardCheck,
    title: 'We Plan Everything',
    text: 'Flights, stays, sightseeing, visas and transport — confirmed and coordinated by our team.',
  },
  {
    icon: PartyPopper,
    title: 'Enjoy Your Journey',
    text: 'Pack your bags. On-trip support stays one message away, wherever your journey takes you.',
  },
]

export default function ProcessSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 70%', 'end 40%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.05),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Your Journey, Our Responsibility"
          description="Four simple steps between you and an unforgettable trip."
        />

        <div ref={trackRef} className="relative mx-auto max-w-5xl">
          <div
            className="timeline-track absolute left-[22px] top-0 h-full w-px sm:left-1/2"
            aria-hidden="true"
          />
          <motion.div
            style={{ scaleY }}
            className="absolute left-[22px] top-0 h-full w-px origin-top bg-gradient-to-b from-orange-500 to-amber-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] sm:left-1/2"
            aria-hidden="true"
          />

          <StaggerGroup className="space-y-12 sm:space-y-16">
            {steps.map((step, i) => {
              const Icon = step.icon
              const left = i % 2 === 0
              return (
                <StaggerItem key={step.title}>
                  <div className={`relative flex gap-6 sm:w-1/2 sm:gap-0 ${left ? 'sm:pr-14' : 'sm:ml-auto sm:pl-14'} pl-14 sm:pl-0 ${left ? 'sm:pl-0' : ''}`}>
                    <span
                      className={`absolute left-0 flex h-11 w-11 items-center justify-center rounded-full border border-orange-500/40 bg-[#0d0d0f] text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.25)] sm:top-0 ${
                        left
                          ? 'sm:left-auto sm:-right-[22px]'
                          : 'sm:-left-[22px]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div
                      className={`group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-orange-400/30 hover:bg-white/[0.05] sm:p-7 ${
                        left ? 'sm:mr-10' : 'sm:ml-10'
                      }`}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-500">
                        Step {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-white">{step.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{step.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
