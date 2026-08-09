'use client'

import { useState, type FormEvent } from 'react'
import { CalendarDays, MessageCircle, PhoneCall, Users } from 'lucide-react'
import { waLink } from '@/data/contact'
import { telPrimary } from '@/lib/helpers'
import type { TravelPackage } from '@/data/packages'

const inputCls =
  'w-full rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60'

export default function BookingWidget({ pkg }: { pkg: TravelPackage }) {
  const [date, setDate] = useState('')
  const [travellers, setTravellers] = useState(2)

  const estimate = pkg.pricePerPerson * travellers
  const discount = Math.round(((pkg.originalPrice - pkg.pricePerPerson) / pkg.originalPrice) * 100)

  const onBook = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const message = [
      `Hello Sunsky Tourism, I want to book the ${pkg.name} package.`,
      '',
      `Travellers: ${travellers}`,
      date ? `Preferred travel date: ${date}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-orange-400/20 bg-white/[0.03]">
      <div className="border-b border-white/10 bg-gradient-to-r from-orange-500/15 to-transparent p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">Per person (twin sharing)</p>
        <div className="mt-2 flex items-end gap-2">
          <p className="text-4xl font-bold text-white">₹{pkg.pricePerPerson.toLocaleString('en-IN')}</p>
          <p className="pb-1 text-sm text-slate-500 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</p>
        </div>
        <p className="mt-1 text-xs text-emerald-400">You save {discount}% on this package</p>
      </div>
      <form onSubmit={onBook} className="space-y-4 p-6">
        <div>
          <label htmlFor="bw-date" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-orange-400" />
            Travel date
          </label>
          <input id="bw-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label htmlFor="bw-trav" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            <Users className="h-3.5 w-3.5 text-orange-400" />
            Travellers
          </label>
          <select
            id="bw-trav"
            value={travellers}
            onChange={(e) => setTravellers(Number(e.target.value))}
            className={inputCls}
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
              <option key={n} value={n} className="bg-[#0d0d0f]">
                {n} {n === 1 ? 'traveller' : 'travellers'}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5">
          <span className="text-sm text-slate-400">Estimated total</span>
          <span className="text-lg font-bold text-white">₹{estimate.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Final price depends on dates, availability and hotel category. No advance needed for a quote.
        </p>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.25)] transition-all duration-300 hover:-translate-y-0.5"
        >
          <MessageCircle className="h-4 w-4" />
          Book on WhatsApp
        </button>
        <a
          href={telPrimary}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange-400/40 px-6 py-3.5 font-semibold text-orange-300 transition-all duration-300 hover:bg-orange-500 hover:text-white"
        >
          <PhoneCall className="h-4 w-4" />
          Call us instead
        </a>
      </form>
    </div>
  )
}
