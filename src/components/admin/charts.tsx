'use client'

import { type ReactNode } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const tooltipStyle = {
  background: '#0d0d11',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  fontSize: 12,
  color: '#e2e8f0',
}

export function ChartCard({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function TrendChart({ data }: { data: { label: string; visitors: number; pageViews: number; bookings: number; revenue: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="visitors" name="Visitors" stroke="#f97316" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="pageViews" name="Page views" stroke="#38bdf8" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#34d399" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SimpleBar({ data, color = '#f97316' }: { data: { label: string; value: number }[]; color?: string }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="value" name="Count" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const PIE_COLORS = ['#f97316', '#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#64748b']

export function Donut({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="flex h-56 items-center gap-4">
      <div className="h-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-40 space-y-1.5">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              {d.label}
            </span>
            <span className="font-semibold text-slate-200">{total > 0 ? Math.round((d.value / total) * 100) : 0}%</span>
          </div>
        ))}
        {data.length === 0 && <p className="text-xs text-slate-600">No data</p>}
      </div>
    </div>
  )
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(...steps.map((s) => s.value), 1)
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const pctOfMax = Math.round((s.value / max) * 100)
        const conv = i > 0 ? ((s.value / Math.max(1, steps[i - 1].value)) * 100).toFixed(1) : '100'
        return (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">{s.label}</span>
              <span className="text-slate-500">
                {s.value.toLocaleString()} {i > 0 && <span className="text-orange-400">· {conv}%</span>}
              </span>
            </div>
            <div className="h-6 overflow-hidden rounded-lg bg-white/[0.04]">
              <div
                className="flex h-full items-center justify-center rounded-lg bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-[10px] font-bold text-white"
                style={{ width: `${Math.max(pctOfMax, 4)}%` }}
              />
            </div>
          </div>
        )
      })}
      {steps.length === 0 && <p className="py-6 text-center text-xs text-slate-600">No data available for this period</p>}
    </div>
  )
}

export function KpiCard({ label, value, delta, sub, icon }: { label: string; value: string; delta?: number | null; sub?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-white">{value}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {delta !== undefined && delta !== null ? (
          <span className={`text-xs font-bold ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
        ) : (
          <span className="text-xs font-semibold text-emerald-400">● live</span>
        )}
        <span className="truncate text-xs text-slate-600">{sub ?? 'vs previous period'}</span>
      </div>
    </div>
  )
}