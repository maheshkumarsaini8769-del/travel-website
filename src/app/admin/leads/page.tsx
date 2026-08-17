'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, ConfirmDialog, PageHeader, useToast } from '@/components/admin/ui'

const STATUS_BADGES: Record<string, { color: 'amber' | 'sky' | 'green' | 'rose' | 'slate' | 'orange'; label: string }> = {
  new: { color: 'amber', label: 'New' },
  contacted: { color: 'sky', label: 'Contacted' },
  'follow-up': { color: 'orange', label: 'Follow-up' },
  interested: { color: 'sky', label: 'Interested' },
  converted: { color: 'green', label: 'Converted' },
  lost: { color: 'rose', label: 'Lost' },
}

type StatusKey = keyof typeof STATUS_BADGES

interface Lead {
  _id: string
  name: string
  phone: string
  destination?: string
  requirement?: string
  budget?: number
  status: string
  source?: string
  createdAt: number
}

export default function AdminLeads() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Lead | null>(null)

  const setStatus = async (l: Lead, status: StatusKey) => {
    const res = await fetch(`/api/leads/${l._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) toast('success', `Marked ${STATUS_BADGES[status].label.toLowerCase()}`)
    else toast('error', 'Update failed')
  }

  return (
    <div>
      <PageHeader title="Leads & Enquiries" subtitle="Every enquiry from the website, calls and walk-ins — convert them into bookings" />
      <DataTable<Lead>
        columns={[
          {
            key: 'name',
            label: 'Lead',
            render: (l) => (
              <div>
                <p className="font-semibold text-white">{l.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{l.phone} · {new Date(l.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ),
          },
          { key: 'destination', label: 'Interested in', render: (l) => <span className="text-slate-400">{l.destination || '—'}</span> },
          { key: 'requirement', label: 'Requirement', render: (l) => <span className="max-w-[220px] truncate text-slate-400">{l.requirement || '—'}</span> },
          { key: 'budget', label: 'Budget', render: (l) => <span className="text-slate-400">{l.budget ? `₹${l.budget.toLocaleString('en-IN')}` : '—'}</span> },
          { key: 'source', label: 'Source', render: (l) => <span className="text-xs text-slate-500">{l.source || 'website'}</span> },
          {
            key: 'status',
            label: 'Status',
            render: (l) => (
              <select
                value={l.status}
                onChange={(e) => setStatus(l, e.target.value as StatusKey)}
                onClick={(e) => e.stopPropagation()}
                className={`cursor-pointer rounded-lg border border-white/10 bg-[#0d0d10] px-2 py-1.5 text-xs font-bold outline-none ${
                  STATUS_BADGES[l.status]?.color === 'amber' ? 'text-amber-300' :
                  STATUS_BADGES[l.status]?.color === 'sky' ? 'text-sky-300' :
                  STATUS_BADGES[l.status]?.color === 'green' ? 'text-emerald-300' :
                  STATUS_BADGES[l.status]?.color === 'rose' ? 'text-rose-300' : 'text-orange-300'
                }`}
              >
                {Object.entries(STATUS_BADGES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            ),
          },
          {
            key: 'wa',
            label: '',
            render: (l) => (
              <a href={`https://wa.me/${l.phone.replace('+', '')}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-400 hover:underline">
                WhatsApp
              </a>
            ),
          },
        ]}
        fetchUrl={(page, q) => `/api/leads?q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search name, phone, destination…"
        emptyTitle="No leads yet"
        emptyHint="Enquiries from the website contact form land here automatically."
        actions={(l) => (
          <button onClick={() => setToDelete(l)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          const res = await fetch(`/api/leads/${toDelete._id}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Lead deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete lead?"
        message={`${toDelete?.name} — ${toDelete?.phone}. This cannot be undone.`}
      />
    </div>
  )
}
