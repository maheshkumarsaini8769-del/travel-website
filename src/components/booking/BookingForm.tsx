'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { waLink } from '@/data/contact'
import { packages } from '@/data/packages'
import type { TravelPackage } from '@/data/packages'

const inputCls =
  'w-full rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60'

const destinations = ['Rajasthan', 'Goa', 'Kashmir', 'Himachal', 'Dubai', 'International / Other']
const budgets = ['Under ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹40,000', '₹40,000 – ₹60,000', '₹60,000+', 'Not sure yet']

export default function BookingForm() {
  const [sent, setSent] = useState(false)
  const [pkgs, setPkgs] = useState<TravelPackage[]>(packages)

  useEffect(() => {
    let done = false
    fetch('/api/packages')
      .then((r) => r.json())
      .then((data: TravelPackage[]) => {
        if (!done && Array.isArray(data) && data.length) setPkgs(data)
      })
      .catch(() => {})
    return () => {
      done = true
    }
  }, [])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '')
    const phone = String(data.get('phone') ?? '')
    const destination = String(data.get('destination') ?? '')
    const pkg = String(data.get('package') ?? '')
    const date = String(data.get('date') ?? '')
    const travellers = String(data.get('travellers') ?? '')
    const budget = String(data.get('budget') ?? '')
    const notes = String(data.get('notes') ?? '')

    const lines = [
      'Hello Sunsky Tourism, I want to plan a trip.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Destination: ${destination}`,
      pkg ? `Package of interest: ${pkg}` : '',
      date ? `Travel date: ${date}` : '',
      travellers ? `Travellers: ${travellers}` : '',
      `Budget per person: ${budget}`,
      notes ? `Notes: ${notes}` : '',
    ].filter(Boolean)

    window.open(waLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Your name
          </label>
          <input id="bk-name" name="name" type="text" required placeholder="Full name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="bk-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Phone / WhatsApp
          </label>
          <input id="bk-phone" name="phone" type="tel" required placeholder="10-digit mobile number" className={inputCls} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-dest" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Destination
          </label>
          <select id="bk-dest" name="destination" className={inputCls}>
            {destinations.map((d) => (
              <option key={d} value={d} className="bg-[#0d0d0f]">
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bk-pkg" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Package of interest
          </label>
          <select id="bk-pkg" name="package" className={inputCls}>
            <option value="">No specific package</option>
            {pkgs.map((p) => (
              <option key={p.id} value={p.name} className="bg-[#0d0d0f]">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="bk-date" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Travel date
          </label>
          <input id="bk-date" name="date" type="date" className={inputCls} />
        </div>
        <div>
          <label htmlFor="bk-trav" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Travellers
          </label>
          <select id="bk-trav" name="travellers" className={inputCls}>
            {['1', '2', '3', '4', '5', '6', '8', '10+'].map((n) => (
              <option key={n} value={n} className="bg-[#0d0d0f]">
                {n} {n === '1' ? 'traveller' : 'travellers'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bk-budget" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Budget / person
          </label>
          <select id="bk-budget" name="budget" className={inputCls}>
            {budgets.map((b) => (
              <option key={b} value={b} className="bg-[#0d0d0f]">
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="bk-notes" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          Anything else? <span className="font-normal normal-case text-slate-500">(optional)</span>
        </label>
        <textarea
          id="bk-notes"
          name="notes"
          rows={4}
          placeholder="Honeymoon, family trip, hotel preferences, special dates..."
          className={`${inputCls} resize-none rounded-2xl`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
      >
        <Send className="h-4 w-4" />
        {sent ? 'Opening WhatsApp...' : 'Get My Free Quote on WhatsApp'}
      </button>
      <p className="text-center text-xs text-slate-500">No spam, no obligation — just a clear itinerary and honest prices.</p>
    </form>
  )
}
