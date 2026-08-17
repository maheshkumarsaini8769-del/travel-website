'use client'

import { useCallback, useEffect, useState } from 'react'
import { Car, Hotel, Package, Save } from 'lucide-react'
import { Badge, Button, PageHeader, Spinner, useToast } from '@/components/admin/ui'
import type { InventoryItem } from '@/lib/inventory'

function stockStatusOf(it: InventoryItem): { label: string; color: string } {
  if (it.limit <= 0) return { label: 'Unlimited', color: 'slate' }
  if (it.sold === null || it.left === null) return { label: 'Manual stock', color: 'violet' }
  if (it.left <= 0) return { label: 'Sold out', color: 'rose' }
  if (it.left <= Math.ceil(it.limit * 0.25)) return { label: 'Low stock', color: 'amber' }
  return { label: 'In stock', color: 'green' }
}

const TYPE_META = {
  package: { label: 'Package', icon: Package },
  hotel: { label: 'Hotel', icon: Hotel },
  vehicle: { label: 'Vehicle', icon: Car },
} as const

export default function LimitsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<InventoryItem[] | null>(null)
  const [limits, setLimits] = useState<Record<string, number>>({})
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/inventory')
      if (!res.ok) throw new Error()
      const data = (await res.json()) as { items: InventoryItem[] }
      setItems(data.items)
      const init: Record<string, number> = {}
      for (const it of data.items) init[it.id] = it.limit
      setLimits(init)
    } catch {
      setItems([])
      toast('error', 'Inventory could not be loaded — database not connected?')
    }
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  const setLimit = (id: string, raw: string) => {
    setSaved(false)
    const n = raw === '' ? 0 : Math.max(0, Math.floor(Number(raw) || 0))
    setLimits((l) => ({ ...l, [id]: n }))
  }

  const save = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limits }),
      })
      if (!res.ok) throw new Error()
      toast('success', 'Limits saved — shown across the dashboard')
      setSaved(true)
      await load()
    } catch {
      toast('error', 'Save failed — database not connected?')
    } finally {
      setBusy(false)
    }
  }

  if (!items) return <Spinner label="Loading stock & limits…" />

  const withLimit = items.filter((i) => i.limit > 0)
  const totalLimit = withLimit.reduce((s, i) => s + i.limit, 0)
  const totalSold = withLimit.reduce((s, i) => s + (i.sold ?? 0), 0)
  const lowStock = withLimit.filter((i) => stockStatusOf(i).label === 'Low stock')
  const soldOut = withLimit.filter((i) => stockStatusOf(i).label === 'Sold out')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock & Limits"
        subtitle="Fix the quantity limit for every product — remaining stock is calculated automatically"
        actions={
          <Button onClick={save} disabled={busy}>
            <Save className="h-4 w-4" />
            {busy ? 'Saving…' : 'Save limits'}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Products with limit', value: String(withLimit.length), color: 'text-slate-200' },
          { label: 'Total limit Qty', value: totalLimit.toLocaleString('en-IN'), color: 'text-sky-300' },
          { label: 'Total booked', value: totalSold.toLocaleString('en-IN'), color: 'text-orange-300' },
          { label: 'Low / sold out', value: `${lowStock.length} / ${soldOut.length}`, color: 'text-rose-300' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-1 text-lg font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-slate-500">
          No products found yet — seed the database or add packages to see them here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="py-3 pl-5 pr-2 font-semibold">Product</th>
                  <th className="py-3 pr-2 font-semibold">Type</th>
                  <th className="py-3 pr-2 font-semibold">Quantity limit</th>
                  <th className="py-3 pr-2 font-semibold">Booked</th>
                  <th className="py-3 pr-2 font-semibold">Left</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const meta = TYPE_META[it.type]
                  const Icon = meta.icon
                  const status = stockStatusOf(it)
                  const left = it.left
                  const pct = it.limit > 0 && it.sold !== null ? Math.min(100, Math.round(((it.sold ?? 0) / it.limit) * 100)) : null
                  return (
                    <tr key={`${it.type}:${it.id}`} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pl-5 pr-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                            <Icon className="h-3.5 w-3.5 text-orange-400" />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-200">{it.name}</p>
                            <p className="text-[10px] text-slate-600">{it.subtitle || it.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-2">
                        <Badge color={it.type === 'package' ? 'orange' : it.type === 'hotel' ? 'sky' : 'violet'}>{meta.label}</Badge>
                      </td>
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={limits[it.id] ?? 0}
                            onChange={(e) => setLimit(it.id, e.target.value)}
                            className="w-24 rounded-lg border border-white/10 bg-[#0d0d10] px-3 py-2 text-sm font-bold text-white outline-none transition-colors focus:border-orange-400/50"
                          />
                          <span className="text-[10px] text-slate-600">{limits[it.id] === 0 ? 'unlimited' : 'seats'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-2 text-slate-400">{it.sold === null ? '—' : it.sold.toLocaleString('en-IN')}</td>
                      <td className="py-3 pr-2">
                        {left === null ? (
                          <span className="text-slate-600">—</span>
                        ) : (
                          <div className="w-24">
                            <p className={`font-bold ${left <= 0 ? 'text-rose-400' : left <= Math.ceil((it.limit ?? 0) * 0.25) ? 'text-amber-400' : 'text-emerald-300'}`}>
                              {left}
                            </p>
                            {pct !== null && (
                              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                                <div
                                  className={`h-full rounded-full ${pct >= 100 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge color={status.color as 'slate' | 'green' | 'amber' | 'rose' | 'orange' | 'violet'}>{status.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-white/5 px-5 py-3 text-[11px] text-slate-600">
            {saved ? 'Saved — limits are now live. ' : ''}Set a limit to 0 for unlimited. Hotel & vehicle quantities are manual stock; package “Booked” counts live bookings automatically.
          </p>
        </div>
      )}
    </div>
  )
}