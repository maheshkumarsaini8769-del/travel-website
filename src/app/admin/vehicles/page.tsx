'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, Button, ConfirmDialog, Field, Modal, PageHeader, useToast } from '@/components/admin/ui'

interface Vehicle {
  _id: string
  name: string
  type: string
  capacity: number
  driver?: string
  price: number
  availability: boolean
}

export default function AdminVehicles() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Vehicle | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Sedan', capacity: 4, driver: '', price: 0, availability: true })

  const startNew = () => {
    setEditing(null)
    setForm({ name: '', type: 'Sedan', capacity: 4, driver: '', price: 0, availability: true })
    setOpen(true)
  }
  const startEdit = (v: Vehicle) => {
    setEditing(v)
    setForm({ name: v.name, type: v.type ?? 'Sedan', capacity: v.capacity ?? 4, driver: v.driver ?? '', price: v.price ?? 0, availability: v.availability ?? true })
    setOpen(true)
  }

  const toggle = async (v: Vehicle) => {
    const res = await fetch(`/api/vehicles/${v._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: !v.availability }),
    })
    if (res.ok) toast('success', v.availability ? 'Marked unavailable' : 'Marked available')
    else toast('error', 'Update failed')
  }

  const save = async () => {
    if (!form.name.trim()) { toast('error', 'Vehicle name is required'); return }
    setBusy(true)
    try {
      const res = await fetch(editing ? `/api/vehicles/${editing._id}` : '/api/vehicles', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity), price: Number(form.price) }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast('success', editing ? 'Vehicle updated' : 'Vehicle created')
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
        title="Vehicles"
        subtitle="Your fleet and daily rates"
        actions={
          <Button onClick={startNew}>
            <Plus className="h-3.5 w-3.5" /> New Vehicle
          </Button>
        }
      />
      <DataTable<Vehicle>
        columns={[
          {
            key: 'name',
            label: 'Vehicle',
            render: (v) => (
              <div>
                <p className="font-semibold text-white">{v.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{v.type}</p>
              </div>
            ),
          },
          { key: 'capacity', label: 'Capacity', render: (v) => <span className="text-slate-400">{v.capacity} seats</span> },
          { key: 'driver', label: 'Driver', render: (v) => <span className="text-slate-400">{v.driver || '—'}</span> },
          { key: 'price', label: 'Per day', render: (v) => <span className="font-semibold text-slate-200">₹{(v.price ?? 0).toLocaleString('en-IN')}</span> },
          {
            key: 'availability',
            label: 'Available',
            render: (v) => (
              <button onClick={() => toggle(v)} className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${v.availability ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'}`}>
                {v.availability ? 'Available' : 'Unavailable'}
              </button>
            ),
          },
        ]}
        fetchUrl={(page, q) => `/api/vehicles?q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search vehicles…"
        emptyTitle="No vehicles yet"
        emptyHint="Add your fleet to reference it in itineraries."
        actions={(v) => (
          <>
            <button onClick={() => startEdit(v)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white" title="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setToDelete(v)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${editing.name}` : 'New vehicle'}>
        <div className="grid gap-4">
          <Field label="Vehicle name">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none">
              {['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller', 'Bus', 'Coach'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Capacity (seats)">
              <input type="number" min={1} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
            </Field>
            <Field label="Price per day (₹)">
              <input type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
            </Field>
          </div>
          <Field label="Driver">
            <input value={form.driver} onChange={(e) => setForm((f) => ({ ...f, driver: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
          </Field>
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.availability} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))} className="h-4 w-4 accent-orange-500" />
            <span className="text-sm text-slate-300">Available for tours</span>
          </label>
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
          const res = await fetch(`/api/vehicles/${toDelete._id}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Vehicle deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete vehicle?"
        message={`${toDelete?.name} will be removed.`}
      />
    </div>
  )
}
