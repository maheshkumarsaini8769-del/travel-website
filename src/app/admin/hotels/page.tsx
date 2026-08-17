'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, Button, ConfirmDialog, Field, Modal, PageHeader, useToast } from '@/components/admin/ui'

interface Hotel {
  _id: string
  name: string
  location: string
  stars: number
  amenities: string[]
  roomTypes: { name: string; price: number; capacity: number }[]
  availability: boolean
}

export default function AdminHotels() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Hotel | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Hotel | null>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', location: '', stars: 3, amenities: '', rooms: '', availability: true })

  const startNew = () => {
    setEditing(null)
    setForm({ name: '', location: '', stars: 3, amenities: '', rooms: '', availability: true })
    setOpen(true)
  }
  const startEdit = (h: Hotel) => {
    setEditing(h)
    setForm({
      name: h.name,
      location: h.location ?? '',
      stars: h.stars ?? 3,
      amenities: (h.amenities ?? []).join(', '),
      rooms: (h.roomTypes ?? []).map((r) => `${r.name}|${r.price}|${r.capacity}`).join('\n'),
      availability: h.availability ?? true,
    })
    setOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) { toast('error', 'Hotel name is required'); return }
    setBusy(true)
    try {
      const roomTypes = form.rooms.split('\n').map((line) => {
        const [name, price, capacity] = line.split('|').map((s) => s.trim())
        return name ? { name, price: Number(price) || 0, capacity: Number(capacity) || 1 } : null
      }).filter((x): x is { name: string; price: number; capacity: number } => Boolean(x))
      const body = {
        name: form.name,
        location: form.location,
        stars: Number(form.stars),
        amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        roomTypes,
        availability: form.availability,
      }
      const res = await fetch(editing ? `/api/hotels/${editing._id}` : '/api/hotels', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast('success', editing ? 'Hotel updated' : 'Hotel created')
      setOpen(false)
    } catch {
      toast('error', 'Save failed — database not connected?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Hotels"
        subtitle="Accommodations used across packages"
        actions={
          <Button onClick={startNew}>
            <Plus className="h-3.5 w-3.5" /> New Hotel
          </Button>
        }
      />
      <DataTable<Hotel>
        columns={[
          {
            key: 'name',
            label: 'Hotel',
            render: (h) => (
              <div>
                <p className="font-semibold text-white">{h.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{h.location || ''}</p>
              </div>
            ),
          },
          { key: 'stars', label: 'Stars', render: (h) => <span className="text-amber-400">{'★'.repeat(h.stars ?? 0) || '—'}</span> },
          { key: 'roomTypes', label: 'Rooms', render: (h) => <span className="text-slate-400">{(h.roomTypes ?? []).length} types</span> },
          { key: 'price', label: 'From', render: (h) => <span className="font-semibold text-slate-200">₹{(h.roomTypes?.[0]?.price ?? 0).toLocaleString('en-IN')}</span> },
          { key: 'availability', label: 'Availability', render: (h) => <Badge color={h.availability ? 'green' : 'rose'}>{h.availability ? 'Available' : 'Unavailable'}</Badge> },
        ]}
        fetchUrl={(page, q) => `/api/hotels?all=1&q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search hotels…"
        emptyTitle="No hotels yet"
        emptyHint="Hotels are shared across packages."
        actions={(h) => (
          <>
            <button onClick={() => startEdit(h)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white" title="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setToDelete(h)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${editing.name}` : 'New hotel'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hotel name">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
          </Field>
          <Field label="Stars">
            <select value={form.stars} onChange={(e) => setForm((f) => ({ ...f, stars: Number(e.target.value) }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none">
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
            </select>
          </Field>
          <Field label="Amenities (comma separated)">
            <input value={form.amenities} onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Room types" hint="One per line: Room name | price ₹ | capacity">
              <textarea rows={4} value={form.rooms} onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))} placeholder="Deluxe | 2500 | 2&#10;Family Suite | 4500 | 4" className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <label className="inline-flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={form.availability} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))} className="h-4 w-4 accent-orange-500" />
              <span className="text-sm text-slate-300">Available for bookings</span>
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
          const res = await fetch(`/api/hotels/${toDelete._id}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Hotel deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete hotel?"
        message={`${toDelete?.name} will be removed.`}
      />
    </div>
  )
}
