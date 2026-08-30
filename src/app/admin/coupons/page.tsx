'use client'

import { useState, useEffect, useRef } from 'react'
import { Pencil, Plus, Trash2, RefreshCw, Ticket } from 'lucide-react'
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
  perCustomerLimit?: number
  usedCount: number
  active: boolean
  createdAt: number
}

export default function AdminCoupons() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Coupon | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [busy, setBusy] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [form, setForm] = useState({
    code: '',
    type: 'percent' as 'percent' | 'fixed',
    value: 0,
    minBookingValue: '',
    maxDiscount: '',
    expiry: '',
    usageLimit: '',
    perCustomerLimit: '',
    active: true,
  })

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => setRefreshKey((k) => k + 1), 15000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoRefresh])

  const startNew = () => {
    setEditing(null)
    setForm({ code: '', type: 'percent', value: 0, minBookingValue: '', maxDiscount: '', expiry: '', usageLimit: '', perCustomerLimit: '', active: true })
    setOpen(true)
  }

  const startEdit = (c: Coupon) => {
    setEditing(c)
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minBookingValue: c.minBookingValue?.toString() ?? '',
      maxDiscount: c.maxDiscount?.toString() ?? '',
      expiry: c.expiry ? new Date(c.expiry).toISOString().split('T')[0] : '',
      usageLimit: c.usageLimit?.toString() ?? '',
      perCustomerLimit: c.perCustomerLimit?.toString() ?? '',
      active: c.active,
    })
    setOpen(true)
  }

  const save = async () => {
    if (!form.code.trim()) { toast('error', 'Code is required'); return }
    if (form.value <= 0) { toast('error', 'Value must be > 0'); return }
    setBusy(true)
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: form.value,
        minBookingValue: form.minBookingValue ? Number(form.minBookingValue) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        expiry: form.expiry || undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        perCustomerLimit: form.perCustomerLimit ? Number(form.perCustomerLimit) : undefined,
        active: form.active,
      }
      const url = editing ? `/api/coupons/${editing._id}` : '/api/coupons'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }
      toast('success', editing ? 'Coupon updated' : 'Coupon created')
      setOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (e: any) {
      toast('error', e.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (c: Coupon) => {
    try {
      await fetch(`/api/coupons/${c._id}`, { method: 'DELETE' })
      toast('success', 'Coupon deleted')
      setRefreshKey((k) => k + 1)
    } catch {
      toast('error', 'Delete failed')
    }
    setToDelete(null)
  }

  const toggleActive = async (c: Coupon) => {
    try {
      await fetch(`/api/coupons/${c._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !c.active }) })
      setRefreshKey((k) => k + 1)
    } catch {}
  }

  const fmtDate = (ts?: number) => ts ? new Date(ts).toLocaleDateString('en-IN') : '—'
  const fmtCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle="Create and manage discount coupons for customers"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setAutoRefresh(!autoRefresh)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${autoRefresh ? 'bg-orange-500/15 text-orange-400' : 'bg-white/5 text-slate-400'}`}>
              <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto
            </button>
            <Button onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={startNew}>
              <Plus className="h-4 w-4" /> New Coupon
            </Button>
          </div>
        }
      />

      <DataTable
        refreshKey={refreshKey}
        columns={[
          { key: 'code', label: 'Code', render: (c: Coupon) => <span className="font-mono font-bold text-orange-400">{c.code}</span> },
          { key: 'type', label: 'Type', render: (c: Coupon) => <Badge color={c.type === 'percent' ? 'green' : 'sky'}>{c.type === 'percent' ? '% Off' : 'Flat'}</Badge> },
          { key: 'value', label: 'Value', render: (c: Coupon) => c.type === 'percent' ? `${c.value}%` : fmtCurrency(c.value) },
          { key: 'minBookingValue', label: 'Min Booking', render: (c: Coupon) => c.minBookingValue ? fmtCurrency(c.minBookingValue) : '—' },
          { key: 'maxDiscount', label: 'Max Discount', render: (c: Coupon) => c.maxDiscount ? fmtCurrency(c.maxDiscount) : '—' },
          { key: 'expiry', label: 'Expires', render: (c: Coupon) => fmtDate(c.expiry) },
          { key: 'usedCount', label: 'Used', render: (c: Coupon) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ''}` },
          { key: 'active', label: 'Status', render: (c: Coupon) => <Badge color={c.active ? 'green' : 'amber'}>{c.active ? 'Active' : 'Inactive'}</Badge> },
          { key: 'actions', label: '', render: (c: Coupon) => (
            <div className="flex gap-1">
              <button onClick={() => toggleActive(c)} title={c.active ? 'Deactivate' : 'Activate'} className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => startEdit(c)} title="Edit" className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => setToDelete(c)} title="Delete" className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          )},
        ]}
        fetchUrl={(page, q, extra) => `/api/coupons?q=${encodeURIComponent(q)}&page=${page}${extra ? `&${extra}` : ''}`}
        emptyTitle="No coupons yet"
        emptyHint="Create one to offer discounts."
        searchPlaceholder="Search coupons…"
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Coupon' : 'New Coupon'}>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Coupon Code">
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20" className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 font-mono uppercase outline-none focus:border-orange-400/50" />
              </Field>
              <Field label="Discount Type">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50">
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </Field>
              <Field label={form.type === 'percent' ? 'Discount %' : 'Discount Amount (₹)'}>
                <input type="number" value={form.value || ''} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} placeholder="e.g. 10" className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
              </Field>
              <Field label="Expiry Date">
                <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
              </Field>
              <Field label="Min Booking Amount (₹)">
                <input type="number" value={form.minBookingValue} onChange={(e) => setForm({ ...form, minBookingValue: e.target.value })} placeholder="Optional" className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
              </Field>
              <Field label="Max Discount Cap (₹)">
                <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Optional — for % coupons" className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
              </Field>
              <Field label="Total Usage Limit">
                <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Optional — unlimited" className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
              </Field>
              <Field label="Per Customer Limit">
                <input type="number" value={form.perCustomerLimit} onChange={(e) => setForm({ ...form, perCustomerLimit: e.target.value })} placeholder="Optional" className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-white/20 bg-white/5" />
              Active (visible to customers)
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </Modal>

      <ConfirmDialog
          open={!!toDelete}
          title="Delete coupon?"
          message={`Are you sure you want to delete "${toDelete?.code}"? This cannot be undone.`}
          onConfirm={() => toDelete && remove(toDelete)}
          onClose={() => setToDelete(null)}
        />
    </div>
  )
}
