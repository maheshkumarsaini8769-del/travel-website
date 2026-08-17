'use client'

import { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import { Badge, PageHeader, Spinner } from '@/components/admin/ui'

interface AuditEntry {
  _id: string
  action: string
  resource: string
  resourceId?: string
  username?: string
  details?: string
  createdAt: number
}

const ACTION_COLORS: Record<string, 'green' | 'amber' | 'rose' | 'sky' | 'slate'> = {
  create: 'green',
  update: 'amber',
  delete: 'rose',
  read: 'sky',
  login: 'sky',
}

export default function AuditPage() {
  const [items, setItems] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/audit?limit=${limit}`)
      .then((r) => r.json())
      .then((j) => {
        setItems((Array.isArray(j) ? j : []) as AuditEntry[])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [limit])

  const filtered = filter ? items.filter((e) => `${e.action} ${e.resource} ${e.username ?? ''} ${e.details ?? ''}`.toLowerCase().includes(filter.toLowerCase())) : items

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Every create, update and delete across the system" />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by action, resource, user…"
          className="w-72 rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-orange-400/50"
        />
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none">
          <option value={50}>50 entries</option>
          <option value={100}>100 entries</option>
          <option value={200}>200 entries</option>
        </select>
      </div>

      {loading ? (
        <Spinner label="Loading audit log…" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-14 text-center">
          <History className="mx-auto h-8 w-8 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No audit entries match.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">When</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Resource</th>
                  <th className="px-4 py-3 font-semibold">Who</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((e) => (
                  <tr key={e._id} className="hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{new Date(e.createdAt).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><Badge color={ACTION_COLORS[e.action] ?? 'slate'}>{e.action}</Badge></td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-200">{e.resource}</span>
                      {e.resourceId && <span className="ml-1.5 font-mono text-slate-500">{e.resourceId}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{e.username ?? 'system'}</td>
                    <td className="max-w-[320px] truncate px-4 py-3 text-slate-500">{e.details ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}