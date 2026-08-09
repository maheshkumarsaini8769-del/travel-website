'use client'

import { useState } from 'react'
import { MessageCircle, CheckCircle2, MapPin, CalendarDays, Users, Wallet, Heart, Hotel, Bus } from 'lucide-react'
import { waLinkBase } from '@/data/contact'
import { destinations } from '@/data/destinations'

const interests = ['Heritage', 'Adventure', 'Beaches', 'Mountains', 'Wildlife', 'Food & Markets', 'Festivals', 'Shopping', 'Religious Places', 'Photography']

export default function TripPlanner() {
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [days, setDays] = useState('4–7 Days')
  const [travellers, setTravellers] = useState('2')
  const [budget, setBudget] = useState('Budget (value for money)')
  const [style, setStyle] = useState('Family')
  const [hotels, setHotels] = useState('Yes')
  const [transport, setTransport] = useState('Car with driver')
  const [picked, setPicked] = useState<string[]>(['Heritage'])
  const [requests, setRequests] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const toggleInterest = (i: string) =>
    setPicked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lines = [
      'Hello Sunsky Tourism, I would like a custom trip plan.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Destination: ${destination || 'Open to suggestions'}`,
      `Travelling from: ${date ? date : 'Flexible dates'}`,
      `Duration: ${days}`,
      `Travellers: ${travellers}`,
      `Budget: ${budget}`,
      `Travel style: ${style}`,
      `Interests: ${picked.join(', ') || 'No preference'}`,
      `Hotels needed: ${hotels}`,
      `Transport: ${transport}`,
      requests ? `Special requests: ${requests}` : '',
      '',
      'Please suggest a plan with estimated costs. Thank you!',
    ].filter(Boolean)
    window.open(`${waLinkBase}${encodeURIComponent(lines.join('\n'))}`, '_blank')
    setSent(true)
  }

  const summary = [
    { icon: MapPin, label: 'Destination', value: destination || 'Open to suggestions' },
    { icon: CalendarDays, label: 'Dates', value: date ? date : 'Flexible' },
    { icon: CalendarDays, label: 'Duration', value: days },
    { icon: Users, label: 'Travellers', value: `${travellers} people` },
    { icon: Wallet, label: 'Budget', value: budget },
    { icon: Heart, label: 'Style', value: style },
    { icon: Hotel, label: 'Hotels', value: hotels },
    { icon: Bus, label: 'Transport', value: transport },
  ]

  const inputCls =
    'mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-orange-400/50 focus:outline-none'

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-10">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Destination</span>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className={inputCls}>
              <option value="" className="bg-[#0b0b0e]">I&apos;m open to suggestions</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.name} className="bg-[#0b0b0e]">{d.name}</option>
              ))}
              <option value="Other" className="bg-[#0b0b0e]">Somewhere else (tell us)</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Starting date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputCls} [color-scheme:dark]`} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</span>
            <select value={days} onChange={(e) => setDays(e.target.value)} className={inputCls}>
              {['Weekend (1–3 Days)', '4–7 Days', '8–14 Days', '15+ Days'].map((d) => (
                <option key={d} className="bg-[#0b0b0e]">{d}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Travellers</span>
            <select value={travellers} onChange={(e) => setTravellers(e.target.value)} className={inputCls}>
              {['1', '2', '3', '4', '5', '6', '7', '8+'].map((n) => (
                <option key={n} className="bg-[#0b0b0e]">{n} {n === '1' ? 'person' : 'people'}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Budget</span>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className={inputCls}>
              {['Budget (value for money)', 'Comfort (3–4 star stays)', 'Luxury (5 star & premium)', 'No fixed budget'].map((b) => (
                <option key={b} className="bg-[#0b0b0e]">{b}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Travel style</span>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className={inputCls}>
              {['Family', 'Couple / Honeymoon', 'Friends group', 'Solo', 'Senior citizens', 'Business / Work trip'].map((s) => (
                <option key={s} className="bg-[#0b0b0e]">{s}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hotels / stays needed?</span>
            <select value={hotels} onChange={(e) => setHotels(e.target.value)} className={inputCls}>
              {['Yes, book for us', 'Only suggest options', 'No, we have our own'].map((h) => (
                <option key={h} className="bg-[#0b0b0e]">{h}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Transport</span>
            <select value={transport} onChange={(e) => setTransport(e.target.value)} className={inputCls}>
              {['Car with driver', 'Tempo traveller (group)', 'Flights (help me book)', 'Train', 'Not needed'].map((t) => (
                <option key={t} className="bg-[#0b0b0e]">{t}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">What do you love?</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((i) => {
              const active = picked.includes(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    active
                      ? 'border border-orange-400/50 bg-orange-500/20 text-orange-200'
                      : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:border-orange-400/30 hover:text-white'
                  }`}
                >
                  {i}
                </button>
              )
            })}
          </div>
        </div>

        <label className="mt-7 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Special requests</span>
          <textarea
            rows={3}
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="Early check-in, wheelchair access, honeymoon decoration, vegetarian food…"
            className={`${inputCls} resize-none`}
          />
        </label>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputCls} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone / WhatsApp</span>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98xxxxxx00" className={inputCls} />
          </label>
        </div>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-green-500/25 bg-green-500/10 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
            <p className="mt-3 text-base font-bold text-white">Plan request sent!</p>
            <p className="mt-1.5 text-sm text-slate-400">
              Complete the message in WhatsApp and our travel expert will get back with a personalised plan — usually within a few working hours.
            </p>
          </div>
        ) : (
          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            Get My Free Plan on WhatsApp
          </button>
        )}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          Free consultation · No payment required to plan
        </p>
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">Your plan so far</p>
          <ul className="mt-5 space-y-4">
            {summary.map((row) => (
              <li key={row.label} className="flex items-start gap-3.5">
                <row.icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{row.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-white">{row.value}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-5">
            <p className="text-sm font-semibold text-orange-200">Why plan with us?</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              No template itineraries — every plan is crafted by a real travel expert in Sikar and
              confirmed with you on WhatsApp before any booking.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
