'use client'

import { MessageCircle, Phone, Navigation, Mail, MapPin, UserRound } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { contact, mapsUrl, waLink } from '@/data/contact'

const homeContactMessage = 'Hello Sunsky Tourism, I want to plan my next journey. Please guide me.'

export default function HomeContact() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.06),transparent_50%)]" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact Us"
          title="Plan Your Next Journey"
          description="Call, message or visit us — we usually answer on the first ring."
        />

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <SpotlightCard className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400">
                <UserRound className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Proprietor
              </p>
              <p className="mt-1.5 font-bold text-white">{contact.proprietor}</p>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem>
            <SpotlightCard className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400">
                <Phone className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Call us
              </p>
              {contact.phones.map((phone, i) => (
                <a
                  key={phone}
                  href={`tel:+91${contact.phoneLinks[i]}`}
                  className="mt-1.5 block font-bold text-white transition-colors hover:text-orange-400"
                >
                  {phone}
                </a>
              ))}
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem>
            <SpotlightCard className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400">
                <Mail className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Email us
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1.5 block break-all text-sm font-bold text-white transition-colors hover:text-orange-400"
              >
                {contact.email}
              </a>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem>
            <SpotlightCard className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Visit us
              </p>
              <p className="mt-1.5 text-sm font-bold text-white">{contact.address}</p>
            </SpotlightCard>
          </StaggerItem>
        </StaggerGroup>

        <Reveal className="mt-10">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={waLink(homeContactMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
            <a
              href={`tel:+91${contact.phoneLinks[0]}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/50 sm:w-auto"
            >
              <Navigation className="h-5 w-5 text-orange-400" />
              Get Directions
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
