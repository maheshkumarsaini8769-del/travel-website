'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, ConfirmDialog, PageHeader, useToast } from '@/components/admin/ui'

const STATUS_BADGES: Record<string, { color: 'amber' | 'sky' | 'orange' | 'green' | 'rose' | 'slate'; label: string }> = {
  pending: { color: 'amber', label: 'Pending' },
  confirmed: { color: 'sky', label: 'Confirmed' },
  'in-progress': { color: 'orange', label: 'In progress' },
  completed: { color: 'green', label: 'Completed' },
  cancelled: { color: 'rose', label: 'Cancelled' },
  refunded: { color: 'slate', label: 'Refunded' },
}

type StatusKey = keyof typeof STATUS_BADGES

interface PublicBooking {
  _id: string
  bookingId: string
  customer: { name: string; phone: string }
  packageRef?: { name: string; id?: string }
  destination?: string
  travelDate?: string
  travellers: number
  totalAmount: number
  paidAmount: number
  paymentStatus: string
  status: string
  source: string
  createdAt: number
}

export default function AdminBookings() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<PublicBooking | null>(null)

  const setStatus = async (b: PublicBooking, status: StatusKey) => {
    const res = await fetch(`/api/bookings/${b._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) toast('success', `Marked ${STATUS_BADGES[status].label.toLowerCase()}`)
    else toast('error', 'Update failed')
  }

  return (
    <div>
      <PageHeader title="Bookings" subtitle="Every confirmed and requested trip — update status right from the list" />
      <DataTable<PublicBooking>
        columns={[
          {
            key: 'bookingId',
            label: 'Booking',
            render: (b) => (
              <div>
                <p className="font-mono text-xs font-bold text-white">{b.bookingId}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ),
          },
          {
            key: 'customer',
            label: 'Customer',
            render: (b) => (
              <div>
                <p className="font-semibold text-white">{b.customer?.name || '—'}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{b.customer?.phone || ''}</p>
              </div>
            ),
          },
          { key: 'packageRef', label: 'Package', render: (b) => <span className="max-w-[200px] truncate text-slate-400">{b.packageRef?.name || b.destination || '—'}</span> },
          { key: 'travelDate', label: 'Travel', render: (b) => <span className="text-slate-400">{b.travelDate ? b.travelDate.slice(0, 10) : '—'}</span> },
          { key: 'travellers', label: 'Guests', render: (b) => <span className="text-slate-400">{b.travellers ?? '—'}</span> },
          {
            key: 'amount',
            label: 'Amount',
            render: (b) => (
              <div>
                <p className="font-semibold text-slate-200">₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-emerald-400">paid ₹{(b.paidAmount ?? 0).toLocaleString('en-IN')}</p>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (b) => (
              <select
                value={b.status}
                onChange={(e) => setStatus(b, e.target.value as StatusKey)}
                onClick={(e) => e.stopPropagation()}
                className={`cursor-pointer rounded-lg border border-white/10 bg-[#0d0d10] px-2 py-1.5 text-xs font-bold outline-none ${
                  STATUS_BADGES[b.status]?.color === 'amber' ? 'text-amber-300' :
                  STATUS_BADGES[b.status]?.color === 'sky' ? 'text-sky-300' :
                  STATUS_BADGES[b.status]?.color === 'orange' ? 'text-orange-300' :
                  STATUS_BADGES[b.status]?.color === 'green' ? 'text-emerald-300' :
                  STATUS_BADGES[b.status]?.color === 'rose' ? 'text-rose-300' : 'text-slate-300'
                }`}
              >
                {Object.entries(STATUS_BADGES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            ),
          },
          { key: 'source', label: 'Source', render: (b) => <span className="text-xs text-slate-500">{b.source || 'website'}</span> },
        ]}
        fetchUrl={(page, q) => `/api/bookings?q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search name, phone, booking ID…"
        emptyTitle="No bookings yet"
        emptyHint="Website booking requests and new leads converted to bookings will appear here."
        actions={(b) => (
          <button onClick={() => setToDelete(b)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          const res = await fetch(`/api/bookings/${toDelete._id}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Booking deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete booking?"
        message={`${toDelete?.bookingId} — ${toDelete?.customer?.name}. This cannot be undone.`}
      />
    </div>
  )
}
