'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Upload, X } from 'lucide-react'
import type { TravelPackage, PackageCategory, PackageTheme } from '@/data/packages'
import Image from 'next/image'

const CATEGORIES: PackageCategory[] = ['India', 'Rajasthan', 'Beach', 'Mountain', 'International']
const THEMES: PackageTheme[] = ['Heritage', 'Honeymoon', 'Family', 'Adventure', 'Beach', 'Luxury', 'Nature']

const empty: FormState = {
  id: '',
  name: '',
  duration: '',
  nights: '',
  region: '',
  categories: [],
  theme: [],
  tagline: '',
  description: '',
  overview: '',
  pricePerPerson: 0,
  originalPrice: 0,
  cost: 0,
  currency: '₹',
  basis: 'per person',
  validity: '',
  rating: 0,
  reviewCount: 0,
  image: '',
  gallery: [],
  highlights: [],
  places: [],
  activities: [],
  itinerary: [],
  inclusions: [],
  exclusions: [],
  accommodation: '',
  meals: '',
  hotelCategories: '',
  transportation: '',
  featured: false,
  status: 'published',
  availableDates: [],
  maxTravellers: 0,
  seoTitle: '',
  seoDescription: '',
}

interface FormExtras {
  status: 'draft' | 'published' | 'archived'
  availableDates: string[]
  maxTravellers: number
  seoTitle: string
  seoDescription: string
}

type FormState = Omit<TravelPackage, 'id'> & { id: string } & FormExtras

function toForm(p?: TravelPackage | null): FormState {
  return p ? { ...empty, ...JSON.parse(JSON.stringify(p)) } : empty
}

function fromForm(f: FormState): FormState {
  return {
    ...f,
    pricePerPerson: Number(f.pricePerPerson) || 0,
    originalPrice: Number(f.originalPrice) || 0,
    cost: Number(f.cost) || 0,
    rating: Number(f.rating) || 0,
    reviewCount: Number(f.reviewCount) || 0,
    featured: Boolean(f.featured),
    status: f.status ?? 'published',
    maxTravellers: Number(f.maxTravellers) || 0,
    itinerary: f.itinerary
      .filter((d) => d.title || d.text)
      .map((d, i) => ({ day: Number(d.day) || i + 1, title: d.title, text: d.text })),
  }
}

async function uploadImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ data: dataUrl, name: file.name }),
  })
  if (!res.ok) throw new Error(`Upload failed (${res.status})`)
  const json = await res.json()
  return `/api/images/${json.id}`
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-orange-400/60'
const textareaCls = inputCls + ' min-h-20 resize-y'
const labelCls = 'mb-1.5 block text-xs font-semibold text-slate-400'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <legend className="px-2 text-xs font-bold uppercase tracking-widest text-orange-400">{title}</legend>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(active ? value.filter((v) => v !== o) : [...value, o])}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'border-orange-400/60 bg-orange-500/15 text-orange-300'
                : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export default function PackageForm({ initial, editableId }: { initial?: TravelPackage | null; editableId?: boolean }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => toForm(initial))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const imageInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))
  const lineToArray = (v: string) => v.split('\n').map((x) => x.trim()).filter(Boolean)
  const arrayToLines = (a: string[]) => a.join('\n')

  const handleImage = async (files: FileList | null) => {
    if (!files?.length || uploading) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(files[0])
      setForm((f) => ({
        ...f,
        image: url,
        gallery: f.gallery.includes(url) ? f.gallery : [...f.gallery, url],
        tagline: f.tagline || f.name,
      }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (imageInput.current) imageInput.current.value = ''
    }
  }

  const handleGallery = async (files: FileList | null) => {
    if (!files?.length || uploading) return
    setUploading(true)
    setError('')
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) urls.push(await uploadImage(file))
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls.filter((u) => !f.gallery.includes(u))] }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (galleryInput.current) galleryInput.current.value = ''
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Name is required')
    setBusy(true)
    setError('')
    try {
      const pkg = fromForm(form)
      const res = editing
        ? await fetch(`/api/packages/${pkg.id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(pkg),
          })
        : await fetch('/api/packages', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(pkg),
          })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Save failed (${res.status})`)
      }
      router.push('/admin/packages')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const editing = Boolean(editableId && initial?.id)

  return (
    <form onSubmit={submit} className="grid gap-5">
      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
          {error}
        </div>
      ) : null}

      <Section title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Package ID (URL slug, must be unique)" className="sm:col-span-2">
            <input
              value={form.id}
              onChange={(e) => update('id', e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase())}
              placeholder="e.g. goa-beach-luxury"
              disabled={editing}
              className={inputCls + (editing ? ' opacity-50' : '')}
            />
          </Field>
          <Field label="Name *">
            <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Goa Beach Luxury" className={inputCls} />
          </Field>
          <Field label="Tagline">
            <input value={form.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="Short hook line" className={inputCls} />
          </Field>
          <Field label="Duration">
            <input value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="e.g. 5 Days" className={inputCls} />
          </Field>
          <Field label="Nights">
            <input value={form.nights} onChange={(e) => update('nights', e.target.value)} placeholder="e.g. 4N / 5D" className={inputCls} />
          </Field>
          <Field label="Region">
            <input value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="e.g. Goa" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rating (0–5)">
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => update('rating', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Reviews">
              <input
                type="number"
                min={0}
                value={form.reviewCount}
                onChange={(e) => update('reviewCount', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Categories">
              <ChipRow options={CATEGORIES} value={form.categories} onChange={(v) => update('categories', v as PackageCategory[])} />
            </Field>
            <div className="mt-3">
              <Field label="Themes">
                <ChipRow options={THEMES} value={form.theme} onChange={(v) => update('theme', v as PackageTheme[])} />
              </Field>
            </div>
          </div>
          <Field label="Status" className="sm:col-span-1">
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value as 'draft' | 'published' | 'archived')}
              className={inputCls}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Featured on site" className="sm:col-span-1">
            <label className="inline-flex cursor-pointer items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.featured}
                onClick={() => update('featured', !form.featured)}
                className={`relative h-6 w-11 rounded-full transition-colors ${form.featured ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${form.featured ? 'left-[22px]' : 'left-0.5'}`}
                />
              </button>
              <span className="text-sm text-slate-300">{form.featured ? 'Featured in hero & highlights' : 'Standard listing'}</span>
            </label>
          </Field>
        </div>
      </Section>

      <Section title="Description">
        <Field label="Short description">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="One-line summary shown on cards"
            className={textareaCls}
          />
        </Field>
        <Field label="Overview">
          <textarea
            value={form.overview}
            onChange={(e) => update('overview', e.target.value)}
            placeholder="Longer paragraph shown on the detail page"
            className={textareaCls}
          />
        </Field>
      </Section>

      <Section title="Pricing">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Price per person (₹)">
            <input
              type="number"
              min={0}
              value={form.pricePerPerson || ''}
              onChange={(e) => update('pricePerPerson', e.target.value === '' ? 0 : Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Original price">
            <input
              type="number"
              min={0}
              value={form.originalPrice || ''}
              onChange={(e) => update('originalPrice', e.target.value === '' ? 0 : Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Your cost (₹)">
            <input
              type="number"
              min={0}
              value={form.cost || ''}
              onChange={(e) => update('cost', e.target.value === '' ? 0 : Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Currency">
            <input value={form.currency} onChange={(e) => update('currency', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Price basis">
            <input value={form.basis} onChange={(e) => update('basis', e.target.value)} placeholder="per person" className={inputCls} />
          </Field>
          <Field label="Offer validity">
            <input value={form.validity} onChange={(e) => update('validity', e.target.value)} placeholder="e.g. Until 31 Dec 2026" className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="Images">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Field label="Cover image">
              <input ref={imageInput} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files)} className="hidden" />
              <div
                onClick={() => imageInput.current?.click()}
                className={`flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors ${
                  uploading ? 'border-orange-400/60' : 'border-white/15 hover:border-orange-400/40'
                }`}
              >
                {form.image ? (
                  <Image src={form.image} alt="Cover preview" width={640} height={360} className="h-full w-full object-cover" />
                ) : (
                  <div className="p-6 text-center">
                    <Upload className="mx-auto h-6 w-6 text-slate-500" />
                    <p className="mt-2 text-xs text-slate-500">{uploading ? 'Uploading & storing to MongoDB…' : 'Click to upload cover (stored in MongoDB)'}</p>
                  </div>
                )}
              </div>
              {form.image ? (
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg bg-black/40 px-3 py-2 text-[11px] text-slate-400">{form.image}</code>
                  <button
                    type="button"
                    onClick={() => update('image', '')}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-rose-300"
                    title="Remove cover"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null}
            </Field>
          </div>
          <div>
            <Field label={`Gallery (${form.gallery.length} images)`}>
              <input ref={galleryInput} type="file" accept="image/*" multiple onChange={(e) => handleGallery(e.target.files)} className="hidden" />
              <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto pr-1">
                {form.gallery.map((url, i) => (
                  <div key={url} className="group relative aspect-video overflow-hidden rounded-lg border border-white/10">
                    <Image src={url} alt={`Gallery ${i + 1}`} width={200} height={120} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => update('gallery', form.gallery.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 rounded-md bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {form.gallery.length < 9 ? (
                  <button
                    type="button"
                    onClick={() => galleryInput.current?.click()}
                    disabled={uploading}
                    className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-white/15 text-slate-500 transition-colors hover:border-orange-400/40 hover:text-slate-300 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Images are uploaded to MongoDB and served from <code>/api/images/…</code>
              </p>
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Itinerary">
        {form.itinerary.length === 0 ? (
          <p className="text-sm text-slate-500">No days yet.</p>
        ) : (
          <div className="grid gap-3">
            {form.itinerary.map((d, i) => (
              <div key={i} className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 sm:grid-cols-[70px_1fr_1fr_36px]">
                <input
                  type="number"
                  min={1}
                  value={d.day}
                  onChange={(e) => update('itinerary', form.itinerary.map((x, j) => (j === i ? { ...x, day: Number(e.target.value) } : x)))}
                  className={inputCls}
                />
                <input
                  value={d.title}
                  onChange={(e) => update('itinerary', form.itinerary.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  placeholder="Day title"
                  className={inputCls}
                />
                <input
                  value={d.text}
                  onChange={(e) => update('itinerary', form.itinerary.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                  placeholder="Day description"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => update('itinerary', form.itinerary.filter((_, j) => j !== i))}
                  className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => update('itinerary', [...form.itinerary, { day: form.itinerary.length + 1, title: '', text: '' }])}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-orange-400/40"
        >
          + Add day
        </button>
      </Section>

      <Section title="Lists (one item per line)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Highlights">
            <textarea value={arrayToLines(form.highlights)} onChange={(e) => update('highlights', lineToArray(e.target.value))} className={textareaCls} />
          </Field>
          <Field label="Places">
            <textarea value={arrayToLines(form.places)} onChange={(e) => update('places', lineToArray(e.target.value))} className={textareaCls} />
          </Field>
          <Field label="Activities">
            <textarea value={arrayToLines(form.activities)} onChange={(e) => update('activities', lineToArray(e.target.value))} className={textareaCls} />
          </Field>
          <Field label="Inclusions">
            <textarea value={arrayToLines(form.inclusions)} onChange={(e) => update('inclusions', lineToArray(e.target.value))} className={textareaCls} />
          </Field>
          <Field label="Exclusions">
            <textarea value={arrayToLines(form.exclusions)} onChange={(e) => update('exclusions', lineToArray(e.target.value))} className={textareaCls} />
          </Field>
        </div>
      </Section>

      <Section title="Practicalities">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Accommodation">
            <input value={form.accommodation} onChange={(e) => update('accommodation', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Meals">
            <input value={form.meals} onChange={(e) => update('meals', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Hotel categories">
            <input value={form.hotelCategories} onChange={(e) => update('hotelCategories', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Transportation">
            <input value={form.transportation} onChange={(e) => update('transportation', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-2xl border border-white/10 bg-[#0b0b0c]/90 p-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/admin/packages')}
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {editing ? 'Save changes' : 'Create package'}
        </button>
      </div>
    </form>
  )
}