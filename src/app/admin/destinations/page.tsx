'use client'

import { useState, useEffect, useRef } from 'react'
import { Pencil, Plus, RefreshCw, Trash2, Upload } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, Button, ConfirmDialog, Field, Modal, PageHeader, useToast } from '@/components/admin/ui'

interface Dest {
  id?: string
  slug: string
  name: string
  tagline?: string
  description?: string
  image?: string
  gallery?: string[]
  attractions?: string[]
  highlights?: string[]
  bestTime?: string
  categories?: string[]
  category?: string
  featured?: boolean
  status?: string
}

export default function AdminDestinations() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Dest | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Dest | null>(null)
  const [busy, setBusy] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const coverInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    image: '',
    gallery: '',
    attractions: '',
    highlights: '',
    bestTime: '',
    categories: 'India',
    featured: false,
  })

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Read failed'))
        reader.readAsDataURL(file)
      })
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: dataUrl, name: file.name }),
      })
      if (!res.ok) throw new Error('Upload failed')
      const json = await res.json()
      return `/api/images/${json.id}`
    } catch {
      return null
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) setForm((f) => ({ ...f, image: url }))
    if (coverInput.current) coverInput.current.value = ''
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const url = await uploadImage(file)
      if (url) urls.push(url)
    }
    if (urls.length) setForm((f) => ({ ...f, gallery: f.gallery ? f.gallery + ', ' + urls.join(', ') : urls.join(', ') }))
    if (galleryInput.current) galleryInput.current.value = ''
  }

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => setRefreshKey((k) => k + 1), 15000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoRefresh])

  const startNew = () => {
    setEditing(null)
    setForm({ name: '', slug: '', tagline: '', description: '', image: '', gallery: '', attractions: '', highlights: '', bestTime: '', categories: 'India', featured: false })
    setOpen(true)
  }

  const seedDefaults = async () => {
    const res = await fetch('/api/admin/seed', { method: 'POST' })
    if (res.ok) toast('success', 'Defaults seeded into the database')
    else toast('error', 'Seed failed — database not connected?')
  }
  const startEdit = (d: Dest) => {
    setEditing(d)
    setForm({
      name: d.name,
      slug: d.slug,
      tagline: d.tagline ?? '',
      description: d.description ?? '',
      image: d.image ?? '',
      gallery: (d.gallery ?? []).join(', '),
      attractions: (d.attractions ?? []).join(', '),
      highlights: (d.highlights ?? []).join(', '),
      bestTime: d.bestTime ?? '',
      categories: d.categories?.[0] ?? 'India',
      featured: Boolean(d.featured),
    })
    setOpen(true)
  }

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast('error', 'Name and slug are required')
      return
    }
    setBusy(true)
    try {
      const body = {
        ...form,
        slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        gallery: form.gallery.split(',').map((s) => s.trim()).filter(Boolean),
        attractions: form.attractions.split(',').map((s) => s.trim()).filter(Boolean),
        highlights: form.highlights.split(',').map((s) => s.trim()).filter(Boolean),
        categories: [form.categories],
      }
      const res = await fetch(editing ? `/api/destinations/${editing.slug}` : '/api/destinations', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(j?.error ?? `HTTP ${res.status}`)
      }
      toast('success', editing ? 'Destination updated' : 'Destination created')
      setOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      toast('error', (e as Error).message.includes('HTTP 409') ? 'Slug already exists' : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Destinations"
        subtitle="Places shown across the site — supported by the database"
        actions={
          <>
            <Button variant="ghost" onClick={seedDefaults}>
              <RefreshCw className="h-3.5 w-3.5" /> Seed defaults
            </Button>
            <Button onClick={startNew}>
              <Plus className="h-4 w-4" /> New Destination
            </Button>
          </>
        }
      />

      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-xs text-slate-400">Auto (15s)</span>
        </label>
      </div>

      <DataTable<Dest>
        refreshKey={refreshKey}
        columns={[
          {
            key: 'name',
            label: 'Destination',
            render: (d) => (
              <div>
                <p className="font-semibold text-white">{d.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{d.slug}</p>
              </div>
            ),
          },
          { key: 'tagline', label: 'Tagline', render: (d) => <span className="max-w-[260px] truncate text-slate-400">{d.tagline || '—'}</span> },
          { key: 'categories', label: 'Category', render: (d) => <span className="text-slate-400">{(d.categories ?? []).join(', ') || '—'}</span> },
          { key: 'bestTime', label: 'Best time', render: (d) => <span className="text-slate-400">{d.bestTime || '—'}</span> },
          {
            key: 'featured',
            label: 'Status',
            render: (d) => (
              <div className="flex flex-wrap gap-1">
                {d.featured && <Badge color="orange">Featured</Badge>}
                <Badge color="green">Live</Badge>
              </div>
            ),
          },
        ]}
        fetchUrl={(page, q) => `/api/destinations?all=1&q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search Destinations…"
        emptyTitle="No Destinations yet"
        emptyHint="Seed defaults or create one manually."
        actions={(d) => (
          <>
            <button onClick={() => startEdit(d)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white" title="Edit">
              <PencilIcon />
            </button>
            <button onClick={() => setToDelete(d)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${editing.name}` : 'New Destination'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <InputCls value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Jaipur" />
          </Field>
          <Field label="Slug" hint="Used in the URL">
            <InputCls value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} placeholder="jaipur" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Tagline">
              <InputCls value={form.tagline} onChange={(v) => setForm((f) => ({ ...f, tagline: v }))} placeholder="The Pink City of India" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description">
              <TextareaCls rows={4} value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Cover image path">
              <div className="flex gap-2">
                <input
                  ref={coverInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
                <input
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="/images/jaipur.jpg or full URL"
                />
                <button
                  type="button"
                  onClick={() => coverInput.current?.click()}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
                >
                  <Upload className="h-4 w-4" /> Upload
                </button>
              </div>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Gallery (comma separated)">
              <div className="flex gap-2">
                <input
                  ref={galleryInput}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
                <textarea
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
                  rows={2}
                  value={form.gallery}
                  onChange={(e) => setForm((f) => ({ ...f, gallery: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => galleryInput.current?.click()}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
                >
                  <Upload className="h-4 w-4" /> Upload
                </button>
              </div>
            </Field>
          </div>
          <Field label="Highlights (comma separated)">
            <TextareaCls rows={2} value={form.highlights} onChange={(v) => setForm((f) => ({ ...f, highlights: v }))} />
          </Field>
          <Field label="Attractions (comma separated)">
            <TextareaCls rows={2} value={form.attractions} onChange={(v) => setForm((f) => ({ ...f, attractions: v }))} />
          </Field>
          <Field label="Best time to visit">
            <InputCls value={form.bestTime} onChange={(v) => setForm((f) => ({ ...f, bestTime: v }))} placeholder="October – March" />
          </Field>
          <Field label="Category">
            <SelectCls value={form.categories} onChange={(v) => setForm((f) => ({ ...f, categories: v }))} options={['India', 'Rajasthan', 'International']} />
          </Field>
          <div className="sm:col-span-2">
            <label className="inline-flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 accent-orange-500" />
              <span className="text-sm text-slate-300">Featured on homepage</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          const res = await fetch(`/api/destinations/${toDelete.slug}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Destination deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete Destination?"
        message={`"${toDelete?.name}" will be removed. Public pages fall back to static defaults.`}
      />
    </div>
  )
}

import { Pencil as PencilIcon } from 'lucide-react'

function InputCls({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
    />
  )
}
function TextareaCls({ value, onChange, rows, placeholder }: { value: string; onChange: (v: string) => void; rows: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
    />
  )
}
function SelectCls({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-orange-400/50"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}








