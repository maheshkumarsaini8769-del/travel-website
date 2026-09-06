'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import type { Tour, TourCategory } from '@/data/tours'
import { tourCategories } from '@/data/tours'
import { destinations } from '@/data/destinations'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-orange-400/60'
const textareaCls = inputCls + ' min-h-20 resize-y'
const labelCls = 'mb-1.5 block text-xs font-semibold text-slate-400'

const empty: Partial<Tour> = {
  id: '',
  slug: '',
  title: '',
  destinationId: 'jaipur',
  destination: 'Jaipur',
  category: 'Heritage' as TourCategory,
  durationLabel: '',
  hours: 3,
  tourType: 'Private or Group',
  language: 'English, Hindi',
  pickup: 'Hotel pickup & drop included',
  groupSize: '2 – 12 travellers',
  price: 0,
  originalPrice: 0,
  priceLabel: '',
  availability: 'Daily',
  cancellation: 'Free cancellation up to 48 hours before start',
  meetingPoint: '',
  accessibility: '',
  tagline: '',
  description: '',
  overview: '',
  images: [],
  highlights: [],
  itinerary: [],
  inclusions: [],
  exclusions: [],
  bestFor: [],
  whatToCarry: [],
  faqs: [],
}

export default function TourForm({ initial, tourId }: { initial?: Tour; tourId?: string }) {
  const router = useRouter()
  const [form, setForm] = useState<Partial<Tour>>(initial ? { ...empty, ...initial } : empty)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const update = <K extends keyof Tour>(key: K, value: Tour[K]) => setForm((f) => ({ ...f, [key]: value }))
  const lineToArray = (v: string) => v.split('\n').map((x) => x.trim()).filter(Boolean)
  const arrayToLines = (a: string[]) => a.join('\n')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title?.trim()) return setError('Title is required')
    setBusy(true)
    setError('')
    try {
      const tourData = {
        ...form,
        id: form.id || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        slug: form.slug || form.id || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        priceLabel: form.price ? `₹${form.price.toLocaleString('en-IN')} per person` : 'Price on request',
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || 0,
        hours: Number(form.hours) || 3,
      }

      const isEdit = !!tourId
      const url = isEdit ? `/api/tours/${tourId}` : '/api/tours'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourData),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Save failed')
        return
      }

      router.push('/admin/tours')
      router.refresh()
    } catch {
      setError('Save failed — network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">{error}</div>
      )}

      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-widest text-orange-400">Identity</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Title *</label>
            <input value={form.title || ''} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Jaipur Heritage Walking Tour" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Destination</label>
            <select value={form.destinationId || ''} onChange={(e) => {
              const dest = destinations.find((d) => d.id === e.target.value)
              update('destinationId', e.target.value)
              update('destination', dest?.name || e.target.value)
            }} className={inputCls}>
              {destinations.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#0d0d0f]">{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category || ''} onChange={(e) => update('category', e.target.value as TourCategory)} className={inputCls}>
              {tourCategories.map((c) => (
                <option key={c} value={c} className="bg-[#0d0d0f]">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <input value={form.durationLabel || ''} onChange={(e) => update('durationLabel', e.target.value)} placeholder="e.g. 3 Hours" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hours</label>
            <input type="number" min={1} value={form.hours || ''} onChange={(e) => update('hours', Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tour Type</label>
            <select value={form.tourType || ''} onChange={(e) => update('tourType', e.target.value as Tour['tourType'])} className={inputCls}>
              <option value="Private or Group" className="bg-[#0d0d0f]">Private or Group</option>
              <option value="Private" className="bg-[#0d0d0f]">Private</option>
              <option value="Group" className="bg-[#0d0d0f]">Group</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Group Size</label>
            <input value={form.groupSize || ''} onChange={(e) => update('groupSize', e.target.value)} placeholder="e.g. 2 – 12 travellers" className={inputCls} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-widest text-orange-400">Pricing</legend>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className={labelCls}>Selling Price (₹) *</label>
            <input type="number" min={0} value={form.price || ''} onChange={(e) => update('price', Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Original Price (₹)</label>
            <input type="number" min={0} value={form.originalPrice || ''} onChange={(e) => update('originalPrice', Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>2-Way Price (₹)</label>
            <input type="number" min={0} value={(form as any).twoWayPrice || ''} onChange={(e) => update('twoWayPrice' as any, Number(e.target.value))} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} placeholder="Round trip price" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Your Cost (₹)</label>
            <input type="number" min={0} value={(form as any).cost || ''} onChange={(e) => update('cost' as any, Number(e.target.value))} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} placeholder="Actual cost to you" className={inputCls} />
            {(form as any).cost > 0 && (form.price ?? 0) > 0 && (
              <p className="mt-1 text-[11px] text-emerald-400">Profit: ₹{((form.price ?? 0) - (form as any).cost).toLocaleString('en-IN')}/person</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-widest text-orange-400">Description</legend>
        <div className="grid gap-4">
          <div>
            <label className={labelCls}>Tagline</label>
            <input value={form.tagline || ''} onChange={(e) => update('tagline', e.target.value)} placeholder="Short hook line" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Short Description</label>
            <textarea value={form.description || ''} onChange={(e) => update('description', e.target.value)} placeholder="One-line summary" className={textareaCls} />
          </div>
          <div>
            <label className={labelCls}>Overview</label>
            <textarea value={form.overview || ''} onChange={(e) => update('overview', e.target.value)} placeholder="Longer paragraph for detail page" className={textareaCls} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-widest text-orange-400">Details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Pickup</label>
            <input value={form.pickup || ''} onChange={(e) => update('pickup', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Meeting Point</label>
            <input value={form.meetingPoint || ''} onChange={(e) => update('meetingPoint', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Language</label>
            <input value={form.language || ''} onChange={(e) => update('language', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cancellation</label>
            <input value={form.cancellation || ''} onChange={(e) => update('cancellation', e.target.value)} className={inputCls} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-widest text-orange-400">Lists (one item per line)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Highlights</label>
            <textarea value={arrayToLines(form.highlights || [])} onChange={(e) => update('highlights', lineToArray(e.target.value))} className={textareaCls} />
          </div>
          <div>
            <label className={labelCls}>Inclusions</label>
            <textarea value={arrayToLines(form.inclusions || [])} onChange={(e) => update('inclusions', lineToArray(e.target.value))} className={textareaCls} />
          </div>
          <div>
            <label className={labelCls}>Exclusions</label>
            <textarea value={arrayToLines(form.exclusions || [])} onChange={(e) => update('exclusions', lineToArray(e.target.value))} className={textareaCls} />
          </div>
          <div>
            <label className={labelCls}>Best For</label>
            <textarea value={arrayToLines(form.bestFor || [])} onChange={(e) => update('bestFor', lineToArray(e.target.value))} className={textareaCls} />
          </div>
        </div>
      </fieldset>

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-2xl border border-white/10 bg-[#0b0b0c]/90 p-4 backdrop-blur-xl">
        <button type="button" onClick={() => router.push('/admin/tours')} className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {tourId ? 'Update Tour' : 'Save Tour'}
        </button>
      </div>
    </form>
  )
}
