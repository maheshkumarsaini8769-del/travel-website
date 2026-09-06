'use client'

import Link from 'next/link'
import { Phone, MessageCircle, Mail, MapPin, Navigation } from 'lucide-react'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  )
}
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { contact as fallback, mapsUrl as fallbackMaps, waLink as fallbackWa } from '@/data/contact'

interface BusinessSettings {
  brand: string
  tagline: string
  phones: string[]
  phoneLinks: string[]
  whatsappPrimary: string
  email: string
  address: string
  addressFull: string
}

interface SocialSettings {
  facebook: string
  instagram: string
  youtube: string
}

interface FooterSettings {
  about: string
  copyright: string
}

interface Settings {
  business: BusinessSettings
  social: SocialSettings
  footer: FooterSettings
}

function useSettings() {
  const [s, setS] = useState<Settings | null>(null)
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setS(d))
      .catch(() => {})
  }, [])
  return s
}

export default function Footer() {
  const year = new Date().getFullYear()
  const s = useSettings()
  const b = s?.business ?? fallback
  const bObj = b as unknown as Record<string, string>
  const lat = bObj.latitude || '27.6094'
  const lng = bObj.longitude || '75.1399'
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
  const waLink = (msg: string) => `https://wa.me/${b.whatsappPrimary ?? fallback.whatsappPrimary}?text=${encodeURIComponent(msg)}`
  const footerAbout = s?.footer?.about || b.tagline || fallback.tagline
  const footerCopyright = s?.footer?.copyright || `© ${year} ${b.brand ?? 'Sunsky Tourism'}. All rights reserved.`

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#060606] text-slate-400">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.webp"
                alt={`${b.brand ?? 'Sunsky Tourism'} logo`}
                width={1536}
                height={1024}
                sizes="40px"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <span className="text-xl font-extrabold tracking-wide text-white">
                SUNSKY<span className="text-orange-400"> TOURISM</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">{footerAbout}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              {b.address ?? fallback.address}
            </p>
            <div className="mt-5 flex gap-3">
              {s?.social?.facebook && s.social.facebook.trim() !== '' ? (
                <a href={s.social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-400" title="Facebook">
                  <FacebookIcon className="h-4 w-4" />
                </a>
              ) : null}
              {s?.social?.instagram && s.social.instagram.trim() !== '' ? (
                <a href={s.social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-pink-400/40 hover:bg-pink-500/10 hover:text-pink-400" title="Instagram">
                  <InstagramIcon className="h-4 w-4" />
                </a>
              ) : null}
              {s?.social?.youtube && s.social.youtube.trim() !== '' ? (
                <a href={s.social.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400" title="YouTube">
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              ) : null}
            </div>
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
              {(b.phones ?? fallback.phones).map((phone: string, i: number) => (
                <li key={i}>
                  <a href={`tel:${(b.phoneLinks ?? fallback.phoneLinks)[i]}`} className="flex items-center gap-2.5 transition-colors hover:text-orange-400">
                    <Phone className="h-4 w-4 text-orange-400" /> {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${b.email ?? fallback.email}`} className="flex items-center gap-2.5 break-all transition-colors hover:text-orange-400">
                  <Mail className="h-4 w-4 shrink-0 text-orange-400" /> {b.email ?? fallback.email}
                </a>
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-orange-400">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-400" /> {b.address ?? fallback.address}
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
                href={`tel:${(b.phoneLinks ?? fallback.phoneLinks)[0]}`}
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
          <p>{footerCopyright}</p>
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