import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import TiltCard from '@/components/ui/TiltCard'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { services } from '@/data/services'
import { ctaImages } from '@/data/images'
import { whatsappDefault } from '@/lib/helpers'
import { Check, ArrowRight } from 'lucide-react'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Services | Sunsky Tourism',
  description:
    'Flights, hotels, tour packages, holiday plans, visa assistance and transportation — every travel service under one roof in Sikar.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Everything your trip needs, in one place."
        description="From flights and hotels to visas and sightseeing cabs — plan your complete journey with a single call."
        image={ctaImages.cinematic}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }]} />

      <section className="relative py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = s.icon
              return (
                <StaggerItem key={s.id}>
                  <TiltCard className={i % 3 === 1 ? 'lg:mt-10' : ''}>
                    <article className="group h-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30">
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          loading="lazy" decoding="async"
                          src={s.image}
                          alt={s.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden="true" />
                        <span className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/40 bg-black/50 text-orange-400 backdrop-blur-md">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-white">{s.name}</h2>
                        <p className="mt-1 text-sm font-medium text-orange-300">{s.short}</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.description}</p>
                        <ul className="mt-4 space-y-2">
                          {s.benefits.map((b) => (
                            <li key={b} className="flex items-center gap-2 text-xs text-slate-300">
                              <Check className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </TiltCard>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <SectionHeading
                  align="left"
                  eyebrow="Custom Planning"
                  title="Need something combined?"
                  className="mb-6"
                />
                <p className="-mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
                  Most of our travellers mix services — flights with hotels, a package with visa
                  help, or a holiday plan with airport transfers. Tell us what your trip needs and
                  we will bundle it with one clear quote.
                </p>
              </div>
              <Link
                href={whatsappDefault}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Build My Trip
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
