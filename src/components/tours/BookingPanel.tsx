'use client'

import { useState } from 'react'
import { MessageCircle, CalendarDays, Users, CheckCircle2, ShieldCheck } from 'lucide-react'
import { waLinkBase } from '@/data/contact'
import type { Tour } from '@/data/tours'

interface BookingPanelProps {
  tour: Tour
}

export default function BookingPanel({ tour }: BookingPanelProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState('2')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lines = [
      `Hello Sunsky Tourism, I would like to book the "${tour.title}" tour.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      date ? `Preferred date: ${date}` : '',
      `Number of travellers: ${guests}`,
      note ? `Message: ${note}` : '',
      '',
      `Tour: ${tour.title} (${tour.destination}) — ${tour.durationLabel}`,
    ].filter(Boolean)
    window.open(`${waLinkBase}${encodeURIComponent(lines.join('\n'))}`, '_blank')
    setSent(true)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Request this tour</p>
          <p className="mt-0.5 text-sm font-semibold text-white">{tour.priceLabel}</p>
        </div>
      </div>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-green-500/25 bg-green-500/10 p-6 text-center">
          <CheckCircle2 className="mx-auto h-9 w-9 text-green-400" />
          <p className="mt-3 text-sm font-semibold text-white">Request sent!</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            Your request has been opened in WhatsApp. Our team will confirm availability and the final
            price for you — usually within a few working hours.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 text-xs font-semibold text-orange-300 underline-offset-4 hover:underline"
          >
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Your name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Phone / WhatsApp</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98xxxxxx00"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:outline-none"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Preferred date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white [color-scheme:dark] focus:border-orange-400/50 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Travellers</span>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-orange-400/50 focus:outline-none"
              >
                {['1', '2', '3', '4', '5', '6', '7', '8+'].map((n) => (
                  <option key={n} value={n} className="bg-[#0b0b0e]">
                    {n} traveller{n === '1' ? '' : 's'}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Anything we should know?</span>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Special requests, children, dietary needs…"
              className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Send Request on WhatsApp
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
            No payment now — we confirm availability &amp; price first
          </p>
        </form>
      )}
    </div>
  )
}
