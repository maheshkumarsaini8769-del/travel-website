'use client'

import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import ParallaxImage from '@/components/ui/ParallaxImage'
import { Reveal } from '@/components/ui/TextReveal'
import TextReveal from '@/components/ui/TextReveal'
import { aboutImages } from '@/data/images'

const points = [
  'Personalized travel planning',
  'Reliable on-trip assistance',
  'Comfortable, vetted stays',
  'Destination guidance',
  'Hassle-free planning',
  'Dedicated customer support',
]

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <ParallaxImage
                src={aboutImages.premium}
                alt="Premium travel planning experience"
                speed={14}
                rounded="rounded-[28px]"
                className="h-[420px] sm:h-[520px] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              />
              <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" aria-hidden="true" />
              <div className="glass-strong absolute -bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl p-5 sm:left-10 sm:right-auto sm:max-w-xs">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-[0_0_25px_rgba(249,115,22,0.45)]">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">Travel made easy</p>
                  <p className="text-xs text-slate-400">Memories made forever</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-400">
                <span className="h-px w-8 bg-orange-500/60" aria-hidden="true" />
                About Sunsky Tourism
              </span>
            </Reveal>
            <TextReveal
              as="h2"
              text="A travel partner you can trust."
              className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                From the forts of Rajasthan to the beaches of Goa and the skylines of Dubai, we plan
                journeys that feel effortless. Every itinerary is built around you — your pace, your
                budget, your idea of a perfect trip.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3}>
              <Link
                href="/about"
                className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Discover Sunsky Tourism
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
