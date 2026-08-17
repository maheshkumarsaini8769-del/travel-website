'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotlightCard from '@/components/ui/SpotlightCard'
import TiltCard from '@/components/ui/TiltCard'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { packages } from '@/data/packages'
import { useEffect, useState } from 'react'
import type { TravelPackage } from '@/data/packages'

export default function PackagesSection() {
  const [list, setList] = useState<TravelPackage[]>(packages)

  useEffect(() => {
    let done = false
    fetch('/api/packages')
      .then((r) => r.json())
      .then((data: TravelPackage[]) => {
        if (!done && Array.isArray(data) && data.length) setList(data)
      })
      .catch(() => {})
    return () => {
      done = true
    }
  }, [])

  const featured = list.find((p) => p.featured) ?? list[0]!
  const rest = list.filter((p) => !p.featured)

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular Journeys"
          title="Travel Packages"
          description="Handpicked journeys — heritage, beaches, mountains and city escapes — each planned down to the last detail."
        />

        <StaggerGroup className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StaggerItem className="lg:row-span-2">
            <TiltCard className="h-full" maxTilt={5}>
              <div className="border-beam relative h-full rounded-[28px] bg-[#0d0d0f]">
                <SpotlightCard className="img-zoom group relative flex h-full min-h-[520px] flex-col justify-end overflow-hidden rounded-[28px]">
                  <Link
                    href={`/packages/${featured.id}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View ${featured.name}`}
                  />
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy" decoding="async"
                    className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                  <span className="absolute left-6 top-6 z-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                    Featured Journey
                  </span>
                  <div className="relative z-10 p-7 sm:p-9">
                    <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
                      <Clock className="h-3.5 w-3.5" /> {featured.duration}
                    </div>
                    <h3 className="text-3xl font-bold text-white sm:text-4xl">{featured.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
                      {featured.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {featured.places.map((place) => (
                        <span
                          key={place}
                          className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md"
                        >
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </TiltCard>
          </StaggerItem>

          {rest.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <TiltCard className="h-full" maxTilt={6}>
                <SpotlightCard className="img-zoom group relative flex h-full min-h-[250px] overflow-hidden rounded-3xl border border-white/10">
                  <Link href={`/packages/${pkg.id}`} className="absolute inset-0 z-10" aria-label={`View ${pkg.name}`} />
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy" decoding="async"
                    className="object-cover opacity-75 transition-all duration-700 group-hover:opacity-90 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                  <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-4 p-7">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-orange-400">
                        <Clock className="h-3.5 w-3.5" /> {pkg.duration}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                      <p className="mt-1.5 text-sm text-slate-300">{pkg.tagline}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:translate-x-1 group-hover:bg-orange-500">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(249,115,22,0.45)]"
          >
            View all packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
