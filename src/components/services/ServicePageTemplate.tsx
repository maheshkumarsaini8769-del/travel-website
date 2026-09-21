'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Check,
  ChevronDown,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Compass,
  MapPin,
} from 'lucide-react'
import { contact, waUrl } from '@/data/contact'

export interface PricingPlan {
  title: string
  duration?: string
  startingPrice?: string
  description: string
  inclusions: string[]
}

export interface ServiceFeature {
  title: string
  description: string
}

export interface ServiceFAQ {
  question: string
  answer: string
}

export interface RelatedLink {
  title: string
  href: string
  description?: string
  excerpt?: string
}

export interface ServicePageProps {
  eyebrow: string
  h1: string
  heroSubtitle: string
  heroImage: string
  canonicalUrl: string
  serviceName: string
  serviceDescription: string
  directAnswer: {
    question: string
    answer: string
    details: string
  }
  overviewParagraphs: string[]
  features: ServiceFeature[]
  pricingPlans?: PricingPlan[]
  faqs: ServiceFAQ[]
  relatedServices?: RelatedLink[]
  relatedGuides?: RelatedLink[]
}

export default function ServicePageTemplate(props: ServicePageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx)
  }

  // Schema: Service + BreadcrumbList + FAQPage
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `https://www.sunskytourism.in${props.canonicalUrl}#service`,
    name: props.serviceName,
    description: props.serviceDescription,
    url: `https://www.sunskytourism.in${props.canonicalUrl}`,
    provider: {
      '@type': 'TravelAgency',
      '@id': 'https://www.sunskytourism.in/#travelagency',
      name: 'Sunsky Tourism',
      telephone: '+919462018302',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'W.No. 45, Industrial Area, Sikar',
        addressLocality: 'Sikar',
        addressRegion: 'Rajasthan',
        postalCode: '332001',
        addressCountry: 'IN',
      },
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Sikar' },
      { '@type': 'AdministrativeArea', name: 'Rajasthan' },
      { '@type': 'Country', name: 'India' },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.sunskytourism.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.sunskytourism.in/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: props.serviceName,
        item: `https://www.sunskytourism.in${props.canonicalUrl}`,
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <Image
            src={props.heroImage}
            alt={props.h1}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-35"
          />
          <div className="cinematic-overlay absolute inset-0" />
          <div className="orb left-[-10%] top-[20%] h-[360px] w-[360px] bg-orange-500/15" aria-hidden="true" />
          <div className="orb right-[-8%] top-[10%] h-[300px] w-[300px] bg-amber-400/10" aria-hidden="true" />
        </div>
        <div className="grain absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Breadcrumb nav */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/services" className="transition-colors hover:text-white">
                    Services
                  </Link>
                </li>
                <li>/</li>
                <li className="text-orange-400" aria-current="page">
                  {props.serviceName}
                </li>
              </ol>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              {props.eyebrow}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
              {props.h1}
            </h1>

            <p className="mt-4 text-base text-slate-300 sm:text-lg sm:leading-relaxed">
              {props.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={waUrl(
                  contact.whatsappPrimary,
                  `Hi Sunsky Tourism, I am interested in ${props.serviceName}. Please share details and pricing.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Inquire on WhatsApp
              </a>
              <a
                href={`tel:${contact.phoneLinks[0]}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-orange-500/40 hover:bg-white/10"
              >
                <PhoneCall className="h-4 w-4 text-orange-400" />
                Call +91 94620 18302
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SCO / AI Search Direct Answer Callout */}
      <section className="relative -mt-6 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-orange-500/30 bg-[#0e0e14] p-6 shadow-2xl sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Direct Answer for Travelers
              </p>
              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                {props.directAnswer.question}
              </h2>
              <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-slate-200">
                {props.directAnswer.answer}
              </p>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
                {props.directAnswer.details}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Features */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                Service Overview
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Why Book With Sunsky Tourism in Sikar?
              </h2>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-slate-300">
                {props.overviewParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Features List */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {props.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-orange-500/30"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-orange-400 shrink-0" />
                      <h3 className="font-semibold text-white">{feat.title}</h3>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Booking Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  <Clock className="h-3.5 w-3.5" /> Fast Consultation
                </span>
                <h3 className="mt-2 text-xl font-bold text-white">
                  Plan Your {props.serviceName}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Get a personalized quotation and travel assistance from our Sikar agency specialists.
                </p>

                <div className="mt-6 space-y-3">
                  <a
                    href={waUrl(
                      contact.whatsappPrimary,
                      `Hello Sunsky Tourism, I want a quote for ${props.serviceName}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                  <a
                    href={`tel:${contact.phoneLinks[0]}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <PhoneCall className="h-4 w-4 text-orange-400" />
                    Call {contact.phones[0]}
                  </a>
                </div>

                <div className="mt-6 border-t border-white/5 pt-5 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    Office: {contact.address}
                  </p>
                  <p className="mt-1 text-slate-500">
                    Open Mon–Sat: 09:00 AM – 07:00 PM IST
                  </p>
                </div>
              </div>

              {/* Related Services */}
              {props.relatedServices && props.relatedServices.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                    Related Travel Services
                  </h4>
                  <ul className="mt-4 space-y-2.5">
                    {props.relatedServices.map((rel) => (
                      <li key={rel.href}>
                        <Link
                          href={rel.href}
                          className="flex items-center justify-between text-xs font-medium text-slate-300 transition-colors hover:text-orange-400"
                        >
                          <span>{rel.title}</span>
                          <ArrowRight className="h-3 w-3 text-orange-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Pricing / Packages Guidance if provided */}
      {props.pricingPlans && props.pricingPlans.length > 0 && (
        <section className="relative border-t border-white/5 bg-[#08080c] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                Transparent Pricing
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Popular Options & Estimates
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Transparent starting estimates with no hidden agency fees. Custom pricing tailored to dates and group size.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {props.pricingPlans.map((plan) => (
                <div
                  key={plan.title}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-orange-500/40"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                    {plan.duration && (
                      <p className="mt-1 text-xs font-medium text-orange-300">
                        {plan.duration}
                      </p>
                    )}
                    {plan.startingPrice && (
                      <div className="mt-4">
                        <span className="text-xs text-slate-400">Starting from</span>
                        <p className="text-2xl font-extrabold text-white">
                          {plan.startingPrice}
                        </p>
                      </div>
                    )}
                    <p className="mt-4 text-xs leading-relaxed text-slate-300">
                      {plan.description}
                    </p>
                    <div className="mt-5 border-t border-white/5 pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Key Inclusions:
                      </p>
                      <ul className="mt-2.5 space-y-1.5">
                        {plan.inclusions.map((inc) => (
                          <li key={inc} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <a
                      href={waUrl(
                        contact.whatsappPrimary,
                        `Hi Sunsky Tourism, I want details about the ${plan.title} option.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 py-2.5 text-xs font-semibold text-orange-400 transition-colors hover:bg-orange-500 hover:text-white"
                    >
                      Inquire on WhatsApp <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visible FAQ Section */}
      <section className="relative border-t border-white/5 bg-[#07070a] py-20 sm:py-24" aria-labelledby="service-faq-title">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </span>
            <h2 id="service-faq-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Got questions about {props.serviceName}? Here are the most common inquiries from our travelers.
            </p>
          </div>

          <div className="mt-10 space-y-3.5">
            {props.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm sm:text-base font-semibold text-white transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-orange-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/5 px-5 pt-3 pb-5 text-xs sm:text-sm leading-relaxed text-slate-300">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Related Travel Guides if provided */}
      {props.relatedGuides && props.relatedGuides.length > 0 && (
        <section className="relative border-t border-white/5 bg-[#09090d] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Helpful Travel Guides & Itineraries
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {props.relatedGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-orange-500/30 hover:bg-white/[0.04]"
                >
                  <h3 className="text-sm font-semibold text-white hover:text-orange-400">
                    {guide.title}
                  </h3>
                  {guide.excerpt && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                      {guide.excerpt}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
