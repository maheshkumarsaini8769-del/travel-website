'use client'

import { useEffect, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { PageHeader, Spinner, ErrorState } from '@/components/admin/ui'

type ReportKey = 'bookings' | 'leads' | 'customers' | 'payments' | 'events' | 'audit'

const SECTIONS: { key: ReportKey; label: string; desc: string }[] = [
  { key: 'bookings', label: 'Bookings', desc: 'Every booking with amounts and status' },
  { key: 'leads', label: 'Leads', desc: 'All enquiries with budgets and follow-ups' },
  { key: 'customers', label: 'Customers', desc: 'Full customer directory' },
  { key: 'payments', label: 'Payments', desc: 'All received payments' },
  { key: 'events', label: 'Events', desc: 'Website analytics events' },
  { key: 'audit', label: 'Audit', desc: 'Admin actions log' },
]

function parseCsv(text: string): string[][] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim() !== '')
  return lines.map((line) => {
    const cells: string[] = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"'
          i++
        } else inQ = !inQ
      } else if (ch === ',' && !inQ) {
        cells.push(cur)
        cur = ''
      } else cur += ch
    }
    cells.push(cur)
    return cells
  })
}

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportKey>('bookings')
  const [days, setDays] = useState<'7' | '30' | '90' | ''>('30')
  const [rows, setRows] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    const q = new URLSearchParams(days ? { days } : {}).toString()
    const u = `/api/reports/${tab}${q ? `?${q}` : ''}`
    setUrl(u)
    fetch(u)
      .then(async (r) => {
        if (!r.ok) throw new Error()
        const text = await r.text()
        if (cancelled) return
        const parsed = parseCsv(text)
        setHeaders(parsed[0] ?? [])
        setRows(parsed.slice(1))
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setHeaders([])
          setRows([])
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [tab, days])

  const print = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<html><head><title>Sunsky report</title><style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px 8px;font-size:12px}th{background:#f3f4f6}</style></head><body>`)
    w.document.write(`<table><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>`)
    for (const r of rows) {
      w.document.write(`<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    }
    w.document.write('</table><script>window.onload=function(){window.print()}</script></body></html>')
    w.document.close()
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Downloadable, printable reports"
        actions={
          <>
            <button onClick={print} disabled={rows.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-orange-400/40 hover:text-white disabled:opacity-40">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <a href={url} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-400">
              <Download className="h-3.5 w-3.5" /> Download CSV
            </a>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${tab === s.key ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {([['7', 'Last 7 days'], ['30', 'Last 30 days'], ['90', 'Last 90 days'], ['', 'All time']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setDays(k)}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors ${days === k ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-xs text-slate-500">{SECTIONS.find((s) => s.key === tab)?.desc}</p>

      {loading ? (
        <Spinner label="Generating report…" />
      ) : error ? (
        <ErrorState message="Could not generate report — database not connected?" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
            <p className="text-xs font-semibold text-slate-300">{rows.length} record{rows.length === 1 ? '' : 's'}</p>
          </div>
          {rows.length === 0 ? (
            <p className="p-10 text-center text-sm text-slate-500">No records in this period.</p>
          ) : (
            <div className="max-h-[62vh] overflow-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#0d0d10] text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    {headers.map((h) => <th key={h} className="border-b border-white/10 px-4 py-3 font-semibold">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      {r.map((c, j) => <td key={j} className="whitespace-nowrap px-4 py-2.5 text-slate-300">{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}