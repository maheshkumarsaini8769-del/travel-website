import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import ContactForm from '@/components/contact/ContactForm'
import FaqAccordion from '@/components/ui/FaqAccordion'
import ReviewSection from '@/components/reviews/ReviewSection'
import SectionHeading from '@/components/ui/SectionHeading'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { contact, mapsUrl } from '@/data/contact'
import { ctaImages } from '@/data/images'
import { getSettings } from '@/lib/settings'
import { Phone, Mail, MapPin, Clock, UserRound } from 'lucide-react'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import JsonLd from '@/components/seo/JsonLd'

const faqs = [
  {
    question: 'How do I get a quote for my trip?',
    answer:
      'Message us on WhatsApp or call us with your destination, travel dates and number of travellers. We send a clear, itemised quote — usually within a few hours.',
  },
  {
    question: 'Do you customise tour packages?',
    answer:
      'Yes. Every package on our site can be reshaped — dates, hotels, cities and budget. Or describe your dream trip and we will build the itinerary from scratch.',
  },
  {
    question: 'Is there any advance payment required to confirm a booking?',
    answer:
      'A small advance confirms your booking and locks in rates. The balance is paid before or during the trip — we keep the payment terms clear from the start.',
  },
  {
    question: 'What happens if my plans change after booking?',
    answer:
      'Call us as early as possible. We work to adjust dates, hotels or transport depending on availability, and we guide you through any charges transparently.',
  },
  {
    question: 'Do you handle visas and international trips?',
    answer:
      'Yes — we provide document checklists, application guidance and appointment support for visas, and we plan complete international journeys including flights and stays.',
  },
  {
    question: 'What are your office hours?',
    answer:
      'We are open from 9:00 AM to 8:00 PM, all seven days. WhatsApp messages outside these hours are answered the same evening.',
  },
]

export const metadata: Metadata = {
  title: 'Contact Us | Sunsky Tourism',
  description:
    'Contact Sunsky Tourism, Sikar — call 94620 18302, WhatsApp, email sunskytourism.in@gmail.com or visit W.No. 45, Industrial Area, Sikar.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | Sunsky Tourism',
    description: 'Contact Sunsky Tourism — call, WhatsApp, email or visit us in Sikar.',
    url: 'https://www.sunskytourism.in/contact',
    images: ['/images/hero.jpg'],
    locale: 'en_IN',
    type: 'website',
  },
}

export default async function ContactPage() {
  const settings = await getSettings()
  const b = settings.business
  const c = settings.contact

  const cards = [
    {
      icon: UserRound,
      label: 'Proprietor',
      value: contact.proprietor,
      sub: contact.proprietorTitle,
      href: null as string | null,
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: b.phones[0],
      sub: b.phones[1],
      href: `tel:${b.phoneLinks[0]}`,
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: b.email,
      sub: contact.website,
      href: `mailto:${b.email}`,
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: b.address,
      sub: 'Open all days',
      href: mapsUrl,
    },
  ]

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={c.headline}
        description={c.subheadline}
        image={ctaImages.cinematic}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => {
              const Icon = c.icon
              const inner = (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    {c.label}
                  </p>
                  <p className="mt-1.5 break-words font-bold text-white">{c.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
                </>
              )
              return (
                <StaggerItem key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="block h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/30"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7">{inner}</div>
                  )}
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col justify-between gap-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                  Office Hours
                </p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Monday – Sunday</p>
                      <p className="mt-0.5 text-sm text-slate-400">9:00 AM – 8:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Sunsky Tourism</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{b.addressFull}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  Messages outside office hours are answered the same evening — WhatsApp is the
                  fastest way to reach us.
                </p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <MapPin className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-white">Send us an enquiry</h2>
              <p className="mt-2 text-sm text-slate-400">
                Fill this in and it opens directly in our WhatsApp with your details — the fastest
                way to get a quote.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Common Questions"
            title="Answers, before you even ask."
          />
          <FaqAccordion items={faqs} className="mt-2" />
        </div>
      </section>
      <ReviewSection compact />
    </>
  )
}
