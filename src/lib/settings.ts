import { settingsCollection, type SettingValue } from './db'
import { contact } from '@/data/contact'

export interface SiteSettings {
  business: {
    brand: string
    tagline: string
    headline: string
    proprietor: string
    proprietorTitle: string
    phones: string[]
    phoneLinks: string[]
    whatsappPrimary: string
    whatsappSecondary: string
    email: string
    website: string
    address: string
    addressFull: string
  }
  hero: {
    eyebrow: string
    title1: string
    title2: string
    description: string
    primaryCta: string
    secondaryCta: string
  }
  about: { title: string; description: string }
  contact: { headline: string; subheadline: string }
  footer: { about: string; copyright: string }
  social: { facebook: string; instagram: string; youtube: string; whatsapp: string }
  seo: { defaultTitle: string; defaultDescription: string }
  booking: { advancePercent: number; minAdvanceDays: number; cancellationPolicy: string }
}

export const defaultSettings: SiteSettings = {
  business: {
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
  },
  hero: {
    eyebrow: 'SUNSKY TOURISM',
    title1: 'Explore More.',
    title2: 'Worry Less.',
    description: 'Premium tour packages, flights, hotels and visa assistance — planned end-to-end from Sikar, Rajasthan.',
    primaryCta: 'Explore Packages',
    secondaryCta: 'Plan Your Trip',
  },
  about: {
    title: 'About Sunsky Tourism',
    description: 'Sunsky Tourism is a trusted travel partner from Sikar, Rajasthan — personalised travel planning, reliable assistance and comfortable stays across India and abroad.',
  },
  contact: {
    headline: 'Plan Your Next Journey',
    subheadline: 'Call, WhatsApp or visit us — we turn your travel plans into an unforgettable experience.',
  },
  footer: {
    about: 'Sunsky Tourism — travel made easy, memories made forever. Tour packages, flights, hotels and visa assistance from Sikar, Rajasthan.',
    copyright: `© ${new Date().getFullYear()} Sunsky Tourism. All rights reserved.`,
  },
  social: { facebook: '', instagram: '', youtube: '', whatsapp: `https://wa.me/${contact.whatsappPrimary}` },
  seo: {
    defaultTitle: 'Sunsky Tourism — Explore More. Worry Less.',
    defaultDescription: 'Travel made easy, memories made forever. Premium tour packages, flights, hotels and visa assistance from Sikar, Rajasthan.',
  },
  booking: {
    advancePercent: 25,
    minAdvanceDays: 3,
    cancellationPolicy: 'Cancellation is subject to Sunsky Tourism policy and third-party charges. Please contact us for details before making changes.',
  },
}

export function mergeSettings(docs: { _id: string; value: SettingValue }[]): SiteSettings {
  const merged = structuredClone(defaultSettings) as unknown as Record<string, Record<string, unknown>>
  for (const doc of docs) {
    const current = merged[doc._id]
    if (current && typeof doc.value === 'object' && doc.value !== null && !Array.isArray(doc.value)) {
      merged[doc._id] = { ...current, ...(doc.value as Record<string, unknown>) }
    }
  }
  return merged as unknown as SiteSettings
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const col = await settingsCollection()
    const docs = await col.find().toArray()
    return mergeSettings(docs)
  } catch {
    return structuredClone(defaultSettings)
  }
}

export async function saveSetting(key: string, value: SettingValue): Promise<void> {
  const col = await settingsCollection()
  await col.updateOne({ _id: key }, { $set: { value, updatedAt: Date.now() } }, { upsert: true })
}
