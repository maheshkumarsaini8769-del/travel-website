'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { services } from '@/data/services'

export default function ServicesSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Everything You Need for the Journey"
          description="One team for your flights, stays, itineraries, visas and transport — so your trip plans itself."
        />

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <StaggerItem key={service.id}>
                <SpotlightCard className="group relative h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-400/30 hover:bg-white/[0.05]">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/25 bg-orange-500/10 text-orange-400 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.35)]">
                    <Icon className="h-6 w-6 transition-transform duration-500 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="relative z-10 mt-6 text-xl font-bold text-white transition-transform duration-300 group-hover:translate-x-0.5">
                    {service.name}
                  </h3>
                  <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-400">
                    {service.short}
                  </p>
                  <Link
                    href="/services"
                    className="relative z-10 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
                  >
                    Learn about {service.name}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
