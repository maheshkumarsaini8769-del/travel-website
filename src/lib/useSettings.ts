'use client'

import { useEffect, useState } from 'react'
import { contact } from '@/data/contact'
import type { SiteSettings } from '@/lib/settings'

type FullSettings = SiteSettings

const fallbackBusiness = {
  brand: contact.brand,
  tagline: contact.tagline,
  headline: contact.headline,
  proprietor: contact.proprietor,
  proprietorTitle: contact.proprietorTitle,
  phones: contact.phones,
  phoneLinks: contact.phoneLinks,
  whatsappPrimary: contact.whatsappPrimary,
  whatsappSecondary: contact.whatsappSecondary,
  email: contact.email,
  website: contact.website,
  address: contact.address,
  addressFull: contact.addressFull,
  latitude: contact.latitude,
  longitude: contact.longitude,
}

const fallbackHero = {
  eyebrow: 'SUNSKY TOURISM',
  title1: 'Explore More.',
  title2: 'Worry Less.',
  description: 'Premium tour packages, flights, hotels and visa assistance — planned end-to-end from Sikar, Rajasthan.',
  primaryCta: 'Explore Packages',
  secondaryCta: 'Plan Your Trip',
}

const fallbackAbout = { title: 'About Sunsky Tourism', description: 'Sunsky Tourism is a trusted travel partner from Sikar, Rajasthan.' }
const fallbackContact = { headline: 'Plan Your Next Journey', subheadline: 'Call, WhatsApp or visit us.' }
const fallbackFooter = { about: 'Sunsky Tourism — travel made easy.', copyright: `© ${new Date().getFullYear()} Sunsky Tourism. All rights reserved.` }
const fallbackSocial = { facebook: '', instagram: '', youtube: '', whatsapp: '' }
const fallbackSeo = { defaultTitle: 'Sunsky Tourism — Explore More. Worry Less.', defaultDescription: 'Travel made easy, memories made forever.' }
const fallbackBooking = { advancePercent: 25, minAdvanceDays: 3, cancellationPolicy: '' }

export function useSettings() {
  const [s, setS] = useState<FullSettings>({
    business: fallbackBusiness as FullSettings['business'],
    hero: fallbackHero,
    about: fallbackAbout,
    contact: fallbackContact,
    footer: fallbackFooter,
    social: fallbackSocial,
    seo: fallbackSeo,
    booking: fallbackBooking,
  })

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: FullSettings) => {
        if (d) setS((prev) => ({
          ...prev,
          business: { ...prev.business, ...(d.business || {}) },
          hero: { ...prev.hero, ...(d.hero || {}) },
          about: { ...prev.about, ...(d.about || {}) },
          contact: { ...prev.contact, ...(d.contact || {}) },
          footer: { ...prev.footer, ...(d.footer || {}) },
          social: { ...prev.social, ...(d.social || {}) },
          seo: { ...prev.seo, ...(d.seo || {}) },
          booking: { ...prev.booking, ...(d.booking || {}) },
        }))
      })
      .catch(() => {})
  }, [])

  return s
}

export function useBusiness() {
  const s = useSettings()
  return s.business
}
