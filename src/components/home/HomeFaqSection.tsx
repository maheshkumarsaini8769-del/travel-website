'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react'
import { contact, waUrl } from '@/data/contact'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What travel services does Sunsky Tourism provide in Sikar?',
    answer:
      'Sunsky Tourism is a full-service travel agency based in Sikar, Rajasthan. We provide comprehensive travel solutions including Rajasthan tour packages, domestic India holiday packages, international tour packages, flight ticket booking, hotel and resort reservations, tourist visa assistance, and cab rentals / airport transfers.',
  },
  {
    question: 'Do you provide customized Rajasthan tour packages?',
    answer:
      'Yes, Rajasthan tour packages are our core specialty. We organize tailor-made itineraries covering Jaipur (the Pink City), Udaipur (City of Lakes), Jaisalmer (golden desert dunes & living fort), Jodhpur (the Blue City), Pushkar, Mount Abu, and Shekhawati heritage circuits. Packages include private sanitized vehicles, verified heritage stays/hotels, camel safaris, and local sightseeing guides.',
  },
  {
    question: 'Can I book domestic and international flights through Sunsky Tourism?',
    answer:
      'Yes, we offer complete domestic and international flight ticketing services from Sikar. We compare real-time fares across all major airlines (IndiGo, Air India, Emirates, SpiceJet, etc.) to get you the best available rates, along with full support for seat selection, meal preferences, date rescheduling, and cancellation assistance.',
  },
  {
    question: 'Do you provide hotel and resort bookings across India and abroad?',
    answer:
      'Yes, we book verified hotels, luxury resorts, heritage havelis, desert camps, and houseboats. Every property is handpicked based on hygiene, guest reviews, and location convenience, ensuring transparent pricing with no hidden charges.',
  },
  {
    question: 'Do you provide international holiday packages like Dubai, Thailand, and Bali?',
    answer:
      'Yes, Sunsky Tourism plans popular international vacations including Dubai (UAE), Thailand (Bangkok, Phuket, Pattaya), Bali (Indonesia), Singapore, Maldives, and Europe. Our international packages can be bundled with flights, luxury hotel stays, guided city tours, desert safaris, and tourist visa processing.',
  },
  {
    question: 'Do you offer tourist visa assistance in Sikar?',
    answer:
      'Yes, we provide end-to-end visa application assistance for tourist and visitor visas to the UAE (Dubai 30/60 days), Schengen countries, the UK, Singapore, Thailand, Malaysia, and more. We assist with document verification, application submission, appointment scheduling, and status tracking.',
  },
  {
    question: 'How can I plan and book a trip from Sikar?',
    answer:
      'Planning a trip with Sunsky Tourism is simple and hassle-free. You can call us directly at +91 94620 18302, send a WhatsApp message, or visit our office at W.No. 45, Industrial Area, Sikar. Our travel specialists will discuss your dates, budget, and destination preferences to provide a personalized, transparent itinerary and quotation.',
  },
  {
    question: 'Where is the Sunsky Tourism office located in Sikar, Rajasthan?',
    answer:
      'Our office is located at W.No. 45, Industrial Area, Sikar, Rajasthan 332001, India. We are open Monday to Saturday from 09:00 AM to 07:00 PM IST. You are welcome to visit us for in-person holiday planning and consultation.',
  },
]

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  // Schema for visible FAQs
  const faqSchema = {
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
  }

  return (
    <section className="relative border-t border-white/5 bg-[#07070a] py-20 sm:py-28" aria-labelledby="home-faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </span>
          <h2 id="home-faq-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Got Questions? We Have Answers.
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Everything you need to know about booking tour packages, flights, hotels, and visas with Sunsky Tourism in Sikar.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-semibold text-white transition-colors sm:p-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-left text-slate-100">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-orange-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/5 px-5 pt-3 pb-6 text-sm leading-relaxed text-slate-300 sm:px-6 sm:text-base">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-6 sm:flex-row sm:p-8">
          <div>
            <h3 className="text-lg font-bold text-white">Have a specific travel question?</h3>
            <p className="mt-1 text-sm text-slate-400">Speak directly to our travel experts in Sikar for instant assistance.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${contact.phoneLinks[0]}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <PhoneCall className="h-3.5 w-3.5 text-orange-400" />
              Call {contact.phones[0]}
            </a>
            <a
              href={waUrl(contact.whatsappPrimary, 'Hi Sunsky Tourism, I have a question about booking travel packages.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
