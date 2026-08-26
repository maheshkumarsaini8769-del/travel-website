'use client'

import { useState, type FormEvent } from 'react'
import { CalendarDays, MessageCircle, PhoneCall, Users, CheckCircle2, Copy, User, Phone } from 'lucide-react'
import { waLink } from '@/data/contact'
import { telPrimary } from '@/lib/helpers'
import type { TravelPackage } from '@/data/packages'

const inputCls =
  'w-full rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60'

interface BookingResult {
  bookingId: string
  name: string
  phone: string
  packageName: string
  travellers: number
  totalAmount: number
  travelDate: string
}

export default function BookingWidget({ pkg }: { pkg: TravelPackage }) {
  const [date, setDate] = useState('')
  const [travellers, setTravellers] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [booking, setBooking] = useState<BookingResult | null>(null)
  const [copied, setCopied] = useState(false)

  const estimate = pkg.pricePerPerson * travellers
  const discount = Math.round(((pkg.originalPrice - pkg.pricePerPerson) / pkg.originalPrice) * 100)

  const onBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setBusy(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          packageId: pkg.id,
          packageName: pkg.name,
          travelDate: date,
          travellers,
          adults: travellers,
          children: 0,
          totalAmount: estimate,
          paidAmount: 0,
          destination: pkg.region,
        }),
      })
      const data = await res.json()
      if (res.ok && data.bookingId) {
        setBooking({
          bookingId: data.bookingId,
          name: name.trim(),
          phone: phone.trim(),
          packageName: pkg.name,
          travellers,
          totalAmount: estimate,
          travelDate: date,
        })
      } else {
        // If booking fails, still open WhatsApp
        openWhatsApp()
      }
    } catch {
      openWhatsApp()
    } finally {
      setBusy(false)
    }
  }

  const openWhatsApp = () => {
    const message = [
      `Hello Sunsky Tourism, I want to book the ${pkg.name} package.`,
      '',
      `Travellers: ${travellers}`,
      date ? `Preferred travel date: ${date}` : '',
      name ? `Name: ${name}` : '',
      phone ? `Phone: ${phone}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
  }

  const copyBookingId = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.bookingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Show booking confirmation
  if (booking) {
    return (
      <div className="overflow-hidden rounded-3xl border border-emerald-400/20 bg-white/[0.03]">
        <div className="border-b border-emerald-400/20 bg-gradient-to-r from-emerald-500/15 to-transparent p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
          <h3 className="mt-3 text-lg font-bold text-white">Booking Confirmed!</h3>
          <p className="mt-1 text-sm text-slate-400">Your booking has been saved. Share this ID on WhatsApp.</p>
        </div>
        <div className="p-6">
          {/* Booking Card */}
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Booking ID</p>
              <button onClick={copyBookingId} className="flex items-center gap-1 text-[10px] text-orange-400 hover:text-orange-300">
                {copied ? 'Copied!' : <><Copy className="h-3 w-3" /> Copy</>}
              </button>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-orange-400">{booking.bookingId}</p>

            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-orange-400" />
                <span className="text-slate-300">{booking.travelDate || 'Flexible'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-orange-400" />
                <span className="text-slate-300">{booking.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-slate-300">+91 {booking.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-orange-400" />
                <span className="text-slate-300">{booking.travellers} travellers</span>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{booking.packageName}</span>
                <span className="text-white">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">Paid</span>
                <span className="text-slate-500">₹0</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">Confirmed</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">Source</span>
                <span className="text-slate-500">website</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Share this Booking ID on WhatsApp to confirm your booking.
          </p>

          <button
            onClick={openWhatsApp}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.25)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Share Booking on WhatsApp
          </button>
          <button
            onClick={() => setBooking(null)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:text-white"
          >
            Book Another Trip
          </button>
        </div>
      </div>
    )
  }

  // Booking form
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
          <label htmlFor="bw-name" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            <User className="h-3.5 w-3.5 text-orange-400" />
            Your name
          </label>
          <input id="bw-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your full name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="bw-phone" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            <Phone className="h-3.5 w-3.5 text-orange-400" />
            Phone number
          </label>
          <input id="bw-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="10-digit mobile number" maxLength={10} className={inputCls} />
        </div>
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
          disabled={busy || !name.trim() || !phone.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            'Saving booking…'
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              Book on WhatsApp
            </>
          )}
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