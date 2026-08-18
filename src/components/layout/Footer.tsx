'use client'

import Link from 'next/link'
import { Phone, MessageCircle, Mail, MapPin, Navigation } from 'lucide-react'
import Image from 'next/image'
import { contact, mapsUrl, waLink } from '@/data/contact'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#060606] text-slate-400">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
              src="/images/logo.webp"
              alt="Sunsky Tourism logo"
              width={1536}
              height={1024}
              sizes="40px"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
              <span className="text-xl font-extrabold tracking-wide text-white">
                SUNSKY<span className="text-orange-400"> TOURISM</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">{contact.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              {contact.address}
            </p>
          </div>

          <nav aria-label="Quick links">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { name: 'Home', href: '/' },
                { name: 'Destinations', href: '/destinations' },
                { name: 'Tours', href: '/tours' },
                { name: 'Packages', href: '/packages' },
                { name: 'Hotels', href: '/hotels' },
                { name: 'Offers', href: '/offers' },
                { name: 'Guides', href: '/travel-guides' },
                { name: 'Plan My Trip', href: '/plan-your-trip' },
                { name: 'Share Feedback', href: '/feedback' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-orange-400">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {['Flights', 'Hotels', 'Tour Packages', 'Holiday Plans', 'Visa Assistance', 'Transportation'].map(
                (s) => (
                  <li key={s}>
                    <Link href="/services" className="transition-colors hover:text-orange-400">
                      {s}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Contact</h3>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <a href={`tel:+91${contact.phoneLinks[0]}`} className="flex items-center gap-2.5 transition-colors hover:text-orange-400">
                  <Phone className="h-4 w-4 text-orange-400" /> {contact.phones[0]}
                </a>
              </li>
              <li>
                <a href={`tel:+91${contact.phoneLinks[1]}`} className="flex items-center gap-2.5 transition-colors hover:text-orange-400">
                  <Phone className="h-4 w-4 text-orange-400" /> {contact.phones[1]}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 break-all transition-colors hover:text-orange-400">
                  <Mail className="h-4 w-4 shrink-0 text-orange-400" /> {contact.email}
                </a>
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-orange-400">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-400" /> {contact.address}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink('Hello Sunsky Tourism, I want to know more about your travel packages.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(37,211,102,0.35)]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={`tel:+91${contact.phoneLinks[0]}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-orange-400/50"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-orange-400/50"
              >
                <Navigation className="h-4 w-4" /> Directions
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row">
          <p>
            © {year} {contact.brand}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="transition-colors hover:text-orange-400">
              Terms
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-orange-400">
              Privacy
            </Link>
            <Link href="/cancellation-policy" className="transition-colors hover:text-orange-400">
              Cancellation
            </Link>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-400">
              Visit Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
