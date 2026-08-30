'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import {
  CalendarCheck, Eye, Globe, MousePointerClick, Phone, Receipt, Search, ShoppingBag, TrendingUp, Users, Wallet, XCircle, MessageCircle, Hourglass, Boxes, RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { KpiCard, TrendChart, SimpleBar, Donut, Funnel, ChartCard } from '@/components/admin/charts'
import { Spinner, ErrorState, Badge } from '@/components/admin/ui'
import { money } from '@/lib/util'
import type { InventoryItem } from '@/lib/inventory'

function stockStatusOf(it: InventoryItem): { label: string; color: string } {
  if (it.limit <= 0) return { label: 'Unlimited', color: 'slate' }
  if (it.sold === null || it.left === null) return { label: 'Manual stock', color: 'violet' }
  if (it.left <= 0) return { label: 'Sold out', color: 'rose' }
  if (it.left <= Math.ceil(it.limit * 0.25)) return { label: 'Low stock', color: 'amber' }
  return { label: 'In stock', color: 'green' }
}

interface DashboardData {
  range: { label: string }
  kpis: Record<string, number | Record<string, number | null>>
  today: Record<string, number>
  trend: { label: string; visitors: number; pageViews: number; bookings: number; revenue: number }[]
  trafficSources: { source: string; count: number }[]
  devices: { device: string; count: number }[]
  browsers: { browser: string; count: number }[]
  osList: { os: string; count: number }[]
  topPackages: { id: string; name: string; views: number; bookClicks: number; whatsapp: number; bookings: number; revenue: number; cost: number; profit: number; costPerPerson: number }[]
  topSearches: { query: string; count: number; withResults: number; zeroResults: number }[]
  funnel: { visitors: number; packageViews: number; enquiries: number; bookings: number; confirmed: number }
  inventory: InventoryItem[]
  live: { time: number; text: string; type: string }[]
}

const RANGES = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'month', label: 'This month' },
]

export default function DashboardPage() {
  const [range, setRange] = useState('30d')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const loadRef = useRef<() => Promise<void>>()
  const [lastRefresh, setLastRefresh] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/dashboard?range=${range}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('failed')
      setData((await res.json()) as DashboardData)
      setLastRefresh(Date.now())
    } catch {
      setError('Dashboard could not be loaded. If the database is not connected yet, whitelist your IP in Atlas and seed the data.')
    } finally {
      setLoading(false)
    }
  }, [range])

  loadRef.current = load

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (autoRefresh) {
      intervalRef.current = setInterval(() => { loadRef.current?.() }, 15000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoRefresh])

  if (loading && !data) return <Spinner label="Loading dashboard…" />
  if (error && !data) return <ErrorState message={error} onRetry={() => void load()} />

  const k = (data?.kpis ?? {}) as Record<string, number>
  const deltas = (data?.kpis?.deltas ?? {}) as Record<string, number | null>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Business Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {data?.range.label} · live first-party analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-xs text-slate-400">Auto (30s)</span>
          </label>
          <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${range === r.id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Today strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: 'Visitors today', value: String(data?.today.visitors ?? 0) },
          { label: 'Page views today', value: String(data?.today.pageViews ?? 0) },
          { label: 'Searches today', value: String(data?.today.searches ?? 0) },
          { label: 'Bookings today', value: String(data?.today.bookings ?? 0) },
          { label: 'Today income', value: money(data?.today.revenue ?? 0), color: 'text-emerald-400' },
          { label: 'Today cost', value: money(data?.today.cost ?? 0), color: 'text-rose-400' },
          { label: 'Complete payments', value: money(data?.today.completedPayments ?? 0), color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-orange-400/20 bg-orange-500/[0.06] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-300/80">{s.label}</p>
            <p className={`mt-1 text-lg font-extrabold ${s.color ?? 'text-white'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Visitors" value={k.visitors?.toLocaleString() ?? '0'} delta={deltas.visitors} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Unique visitors" value={k.uniqueVisitors?.toLocaleString() ?? '0'} delta={deltas.uniqueVisitors} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Page views" value={k.pageViews?.toLocaleString() ?? '0'} delta={deltas.pageViews} icon={<Eye className="h-4 w-4" />} />
        <KpiCard label="Clicks" value={k.clicks?.toLocaleString() ?? '0'} delta={deltas.clicks} icon={<MousePointerClick className="h-4 w-4" />} />
        <KpiCard label="Searches" value={k.searches?.toLocaleString() ?? '0'} delta={deltas.searches} icon={<Search className="h-4 w-4" />} />
        <KpiCard label="Package views" value={k.packageViews?.toLocaleString() ?? '0'} delta={deltas.packageViews} icon={<Globe className="h-4 w-4" />} />
        <KpiCard label="WhatsApp clicks" value={k.whatsappClicks?.toLocaleString() ?? '0'} delta={deltas.whatsappClicks} icon={<MessageCircle className="h-4 w-4" />} />
        <KpiCard label="Enquiries" value={k.enquiries?.toLocaleString() ?? '0'} delta={deltas.enquiries} icon={<ShoppingBag className="h-4 w-4" />} />
        <KpiCard label="Bookings" value={k.bookings?.toLocaleString() ?? '0'} delta={deltas.bookings} icon={<CalendarCheck className="h-4 w-4" />} />
        <KpiCard label="Pending orders" value={k.pendingOrders?.toLocaleString() ?? '0'} delta={deltas.pendingOrders} icon={<Hourglass className="h-4 w-4" />} />
        <KpiCard label="Confirmed" value={k.confirmedBookings?.toLocaleString() ?? '0'} delta={deltas.confirmedBookings} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Cancelled" value={k.cancelledBookings?.toLocaleString() ?? '0'} icon={<XCircle className="h-4 w-4" />} />
        <KpiCard label="Revenue" value={money(k.revenue ?? 0)} delta={deltas.revenue} icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Completed payments" value={money(k.completedPayments ?? 0)} icon={<Receipt className="h-4 w-4" />} />
        <KpiCard label="Pending payments" value={money(k.pendingPayments ?? 0)} icon={<Receipt className="h-4 w-4" />} />
        <KpiCard label="Phone clicks" value="—" icon={<Phone className="h-4 w-4" />} />
        <KpiCard label="Email clicks" value="—" icon={<Globe className="h-4 w-4" />} />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Visitor & activity trend" subtitle="Visitors, page views and bookings per day" className="lg:col-span-2">
          <TrendChart data={data?.trend ?? []} />
        </ChartCard>
        <ChartCard title="Conversion funnel" subtitle="Visitors → views → enquiries → bookings">
          <Funnel
            steps={[
              { label: 'Visitors', value: data?.funnel.visitors ?? 0 },
              { label: 'Package views', value: data?.funnel.packageViews ?? 0 },
              { label: 'Enquiries', value: data?.funnel.enquiries ?? 0 },
              { label: 'Bookings', value: data?.funnel.bookings ?? 0 },
              { label: 'Confirmed', value: data?.funnel.confirmed ?? 0 },
            ]}
          />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Traffic sources" subtitle="Where visitors come from">
          <SimpleBar data={(data?.trafficSources ?? []).map((t) => ({ label: t.source, value: t.count }))} color="#38bdf8" />
        </ChartCard>
        <ChartCard title="Devices" subtitle="Device distribution">
          <Donut data={(data?.devices ?? []).map((d) => ({ label: d.device, value: d.count }))} />
        </ChartCard>
        <ChartCard title="Browsers & OS" subtitle="Compatibility picture">
          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Browsers</p>
              <div className="flex flex-wrap gap-1.5">
                {(data?.browsers ?? []).map((b) => (
                  <Badge key={b.browser}>{b.browser} · {b.count}</Badge>
                ))}
                {(data?.browsers ?? []).length === 0 && <p className="text-xs text-slate-600">No data yet</p>}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Operating systems</p>
              <div className="flex flex-wrap gap-1.5">
                {(data?.osList ?? []).map((o) => (
                  <Badge key={o.os} color="violet">{o.os} · {o.count}</Badge>
                ))}
                {(data?.osList ?? []).length === 0 && <p className="text-xs text-slate-600">No data yet</p>}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top packages" subtitle="Views, clicks, bookings and revenue per package">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-2 font-semibold">Package</th>
                  <th className="py-2 pr-2 font-semibold">Views</th>
                  <th className="py-2 pr-2 font-semibold">Book now</th>
                  <th className="py-2 pr-2 font-semibold">WhatsApp</th>
                  <th className="py-2 pr-2 font-semibold">Bookings</th>
                  <th className="py-2 pr-2 font-semibold">Revenue</th>
                  <th className="py-2 pr-2 font-semibold">Cost</th>
                  <th className="py-2 font-semibold">Profit</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topPackages ?? []).map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 pr-2 font-semibold text-slate-200">{p.name}</td>
                    <td className="py-2.5 pr-2 text-slate-400">{p.views}</td>
                    <td className="py-2.5 pr-2 text-slate-400">{p.bookClicks}</td>
                    <td className="py-2.5 pr-2 text-slate-400">{p.whatsapp}</td>
                    <td className="py-2.5 pr-2 text-slate-400">{p.bookings}</td>
                    <td className="py-2.5 pr-2 font-semibold text-emerald-300">{money(p.revenue)}</td>
                    <td className="py-2.5 pr-2 text-amber-400">{money(p.cost)}</td>
                    <td className={`py-2.5 font-bold ${p.profit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>{money(p.profit)}</td>
                  </tr>
                ))}
                {(data?.topPackages ?? []).length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-600">No package views yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <div className="grid gap-4">
          <ChartCard title="Most searched keywords" subtitle="What customers are looking for">
            <div className="space-y-2">
              {(data?.topSearches ?? []).map((s, i) => (
                <div key={s.query} className="flex items-center gap-3 text-xs">
                  <span className="w-4 text-right font-bold text-slate-600">{i + 1}</span>
                  <span className="flex-1 truncate font-semibold text-slate-200">{s.query}</span>
                  <Badge color={s.zeroResults > 0 ? 'amber' : 'green'}>{s.count} ×</Badge>
                  <span className={`w-14 text-right text-[10px] ${s.zeroResults > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                    {s.zeroResults > 0 ? `${s.zeroResults} no result` : 'has results'}
                  </span>
                </div>
              ))}
              {(data?.topSearches ?? []).length === 0 && <p className="text-xs text-slate-600">No searches yet</p>}
            </div>
          </ChartCard>

          <ChartCard title="Live activity" subtitle="Recent events across the website">
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {(data?.live ?? []).map((e, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="shrink-0 text-[10px] font-semibold text-slate-600">{new Date(e.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex-1 text-slate-300">{e.text}</span>
                </div>
              ))}
              {(data?.live ?? []).length === 0 && <p className="text-xs text-slate-600">No activity yet — visit the website to see live events here.</p>}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Stock & limits */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Stock & Limits" subtitle="Quantity limit vs booked per product" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-2 font-semibold">Product</th>
                  <th className="py-2 pr-2 font-semibold">Limit</th>
                  <th className="py-2 pr-2 font-semibold">Booked</th>
                  <th className="py-2 pr-2 font-semibold">Left</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stockRows(data?.inventory ?? []).map((it) => {
                  const status = stockStatusOf(it)
                  const pct = it.sold !== null ? Math.min(100, Math.round((it.sold / (it.limit || 1)) * 100)) : 0
                  return (
                    <tr key={`${it.type}:${it.id}`} className="border-b border-white/5 last:border-0">
                      <td className="py-2.5 pr-2 font-semibold text-slate-200">{it.name}</td>
                      <td className="py-2.5 pr-2 text-slate-400">{it.limit}</td>
                      <td className="py-2.5 pr-2 text-slate-400">{it.sold?.toLocaleString() ?? '—'}</td>
                      <td className="py-2.5 pr-2">
                        <div className="w-24">
                          <p className={`font-bold ${it.left === null || it.left <= 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
                            {it.left === null ? '∞' : it.left}
                          </p>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full ${pct >= 100 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5">
                        <Badge color={status.color as 'slate' | 'green' | 'amber' | 'rose' | 'orange' | 'violet'}>{status.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
                {(data?.inventory ?? []).filter((i) => i.limit > 0).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-600">No quantity limits set yet — set them in Stock & Limits.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
                <Boxes className="h-4 w-4 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Stock summary</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Manually fixed limits</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { label: 'Products with limit', value: stockRows(data?.inventory ?? []).length },
                { label: 'Total limit qty', value: stockRows(data?.inventory ?? []).reduce((s, i) => s + i.limit, 0) },
                { label: 'Total booked', value: stockRows(data?.inventory ?? []).reduce((s, i) => s + (i.sold ?? 0), 0) },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-bold text-slate-200">{r.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <Link
              href="/admin/limits"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2.5 text-xs font-bold text-orange-300 transition-colors hover:bg-orange-500/20"
            >
              Manage Stock & Limits
            </Link>
          </div>
        </div>
      </div>

      <p className="pt-2 text-center text-[11px] text-slate-700">All metrics computed from real database events · No fake data</p>
    </div>
  )
}

function stockRows(items: InventoryItem[]): InventoryItem[] {
  return items
    .filter((i) => i.limit > 0)
    .sort((a, b) => {
      const pa = a.left === null ? -1 : a.left <= 0 ? 0 : a.left <= Math.ceil(a.limit * 0.25) ? 1 : 2
      const pb = b.left === null ? -1 : b.left <= 0 ? 0 : b.left <= Math.ceil(b.limit * 0.25) ? 1 : 2
      return pa - pb
    })
    .slice(0, 10)
}
