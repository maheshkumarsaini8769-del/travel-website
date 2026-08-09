'use client'

import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { contact, waLinkBase } from '@/data/contact'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors duration-300 focus:border-orange-400/60 focus:bg-white/[0.06]'

export default function ContactForm() {
  const [sending, setSending] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '')
    const phone = String(data.get('phone') || '')
    const email = String(data.get('email') || '')
    const destination = String(data.get('destination') || '')
    const message = String(data.get('message') || '')

    const text = [
      `Hello Sunsky Tourism, I would like to enquire about a trip.`,
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : '',
      destination ? `Interested in: ${destination}` : '',
      message ? `Message: ${message}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    setSending(true)
    window.open(waLinkBase + encodeURIComponent(text), '_blank', 'noopener,noreferrer')
    setTimeout(() => setSending(false), 1200)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Name
          </label>
          <input id="name" name="name" type="text" required placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" required placeholder="Your mobile number" className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Email
        </label>
        <input id="email" name="email" type="email" placeholder="you@example.com" className={inputCls} />
      </div>

      <div>
        <label htmlFor="destination" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Destination / Package
        </label>
        <input
          id="destination"
          name="destination"
          type="text"
          placeholder="e.g. Rajasthan Heritage, Dubai, Goa..."
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your trip — dates, travellers, budget..."
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {sending ? 'Opening WhatsApp...' : 'Send Enquiry on WhatsApp'}
      </button>
      <p className="text-center text-xs text-slate-500">
        Your enquiry opens in WhatsApp — no forms lost in inboxes.
      </p>
    </form>
  )
}
