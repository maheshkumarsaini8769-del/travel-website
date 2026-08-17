'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, Button, ConfirmDialog, Field, Modal, PageHeader, useToast } from '@/components/admin/ui'

interface Coupon {
  _id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  minBookingValue?: number
  maxDiscount?: number
  expiry?: number
  usageLimit?: number
  usedCount: number
  active: boolean
}

export default function AdminCoupons() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Coupon | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percent' as 'percent' | 'fixed', value: 0, minBookingValue: '', maxDiscount: '', expiry: '', active: true })

  const startNew = () => {
    setEditing(null)
    setForm({ code: '', type: 'percent', value: 0, minBookingValue: '', maxDiscount: '', expiry: '', active: true })
    setOpen(true)
  }
  const startEdit = (c: Coupon) => {
    setEditing(c)
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minBookingValue: c.minBookingValue ? String(c.minBookingValue) : '',
      maxDiscount: c.maxDiscount ? String(c.maxDiscount) : '',
      expiry: c.expiry ? new Date(c.expiry).toISOString().slice(0, 10) : '',
      active: c.active,
    })
    setOpen(true)
  }

  const save = async () => {
    if (!form.code.trim() || form.value <= 0) { toast('error', 'Code and value are required'); return }
    setBusy(true)
    try {
      const res = await fetch(editing ? `/api/coupons/${editing.code}` : '/api/coupons', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          type: form.type,
          value: Number(form.value),
          minBookingValue: form.minBookingValue ? Number(form.minBookingValue) : undefined,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          expiry: form.expiry ? new Date(form.expiry).getTime() : undefined,
          active: form.active,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast('success', editing ? 'Coupon updated' : 'Coupon created')
      setOpen(false)
    } catch {
      toast('error', 'Save failed — code may already exist')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Coupons & Offers"
        subtitle="Discount codes customers can apply at booking"
        actions={
          <Button onClick={startNew}>
            <Plus className="h-3.5 w-3.5" /> New Coupon
          </Button>
        }
      />
      <DataTable<Coupon>
        columns={[
          { key: 'code', label: 'Code', render: (c) => <span className="rounded-md bg-orange-500/10 px-2 py-0.5 font-mono text-xs font-bold text-orange-300">{c.code}</span> },
          {
            key: 'value',
            label: 'Discount',
            render: (c) => <span className="font-semibold text-slate-200">{c.type === 'percent' ? `${c.value}%` : `₹${(c.value ?? 0).toLocaleString('en-IN')}`}</span>,
          },
          { key: 'minBookingValue', label: 'Min booking', render: (c) => <span className="text-slate-400">{c.minBookingValue ? `₹${c.minBookingValue.toLocaleString('en-IN')}` : '—'}</span> },
          { key: 'usage', label: 'Usage', render: (c) => <span className="text-slate-400">{c.usedCount ?? 0}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</span> },
          { key: 'expiry', label: 'Expiry', render: (c) => <span className="text-slate-400">{c.expiry ? new Date(c.expiry).toLocaleDateString('en-IN') : 'Never'}</span> },
          {
            key: 'active',
            label: 'Status',
            render: (c) => {
              const expired = c.expiry && c.expiry < Date.now()
              return <Badge color={c.active && !expired ? 'green' : 'rose'}>{c.active && !expired ? 'Active' : expired ? 'Expired' : 'Disabled'}</Badge>
            },
          },
        ]}
        fetchUrl={(page, q) => `/api/coupons?q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search coupon code…"
        emptyTitle="No coupons yet"
        emptyHint="Create discount codes to show on the website."
        actions={(c) => (
          <>
            <button onClick={() => startEdit(c)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white" title="Edit">
              <PencilIcon />
            </button>
            <button onClick={() => setToDelete(c)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${editing.code}` : 'New coupon'}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Code">
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" placeholder="SUMMER25" />
            </Field>
            <Field label="Type">
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'percent' | 'fixed' }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none">
                <option value="percent">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={form.type === 'percent' ? 'Discount %' : 'Discount (₹)'}>
              <input type="number" min={1} value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
            </Field>
            <Field label="Min booking value (₹)">
              <input type="number" min={0} value={form.minBookingValue} onChange={(e) => setForm((f) => ({ ...f, minBookingValue: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
            </Field>
            <Field label="Max discount (₹)">
              <input type="number" min={0} value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
            </Field>
            <Field label="Expiry date">
              <input type="date" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
            </Field>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-4 w-4 accent-orange-500" />
            <span className="text-sm text-slate-300">Active</span>
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
          const res = await fetch(`/api/coupons/${toDelete.code}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Coupon deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete coupon?"
        message={`${toDelete?.code} will be removed.`}
      />
    </div>
  )
}

function PencilIcon() {
  return <Pencil className="h-3.5 w-3.5" />
}
