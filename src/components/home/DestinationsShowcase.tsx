'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Compass } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotlightCard from '@/components/ui/SpotlightCard'
import TiltCard from '@/components/ui/TiltCard'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { destinations } from '@/data/destinations'

const bento = [
  { id: 'jaipur', name: 'Rajasthan', className: 'lg:col-span-2 lg:row-span-2 h-[380px] lg:h-full', big: true },
  { id: 'kashmir', name: 'Kashmir', className: 'h-[260px] lg:h-full' },
  { id: 'dubai', name: 'Dubai', className: 'h-[260px] lg:h-full' },
  { id: 'goa', name: 'Goa', className: 'h-[240px]' },
  { id: 'udaipur', name: 'Udaipur', className: 'h-[240px]' },
  { id: 'jaisalmer', name: 'Jaisalmer', className: 'h-[240px]' },
]

export default function DestinationsShowcase() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore Destinations"
          title="Where Will You Go Next?"
          description="From the forts of Rajasthan to the beaches of Goa and the skylines of Dubai — pick your next story."
        />

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[260px]">
          {bento.map((item) => {
            const d = destinations.find((x) => x.id === item.id)!
            return (
              <StaggerItem key={item.id} className={item.className}>
                <TiltCard className="h-full">
                  <SpotlightCard className="img-zoom group relative h-full overflow-hidden rounded-3xl border border-white/10">
                    <Link
                      href={`/destinations/${item.id}`}
                      className="absolute inset-0 z-10"
                      aria-label={`Explore ${d.name}`}
                    />
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy" decoding="async"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-400">
                        {d.region}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-3">
                        <h3 className={`font-bold text-white ${item.big ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>
                          {d.name}
                        </h3>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:translate-x-1 group-hover:border-orange-400/60 group-hover:bg-orange-500 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                      {item.big ? (
                        <p className="mt-2 max-w-sm text-sm text-slate-300">{d.description}</p>
                      ) : null}
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        <Reveal className="mt-12 text-center">
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-orange-400/50 hover:bg-orange-500/10"
          >
            <Compass className="h-4 w-4 text-orange-400 transition-transform duration-300 group-hover:rotate-45" />
            View all destinations
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
