'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, ConfirmDialog, PageHeader, useToast } from '@/components/admin/ui'

interface Payment {
  _id: string
  paymentId: string
  bookingId: string
  customerName: string
  amount: number
  method: string
  status: string
  transactionId?: string
  date: number
}

export default function AdminPayments() {
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<Payment | null>(null)

  return (
    <div>
      <PageHeader title="Payments" subtitle="Every rupee received against bookings" />
      <DataTable<Payment>
        columns={[
          {
            key: 'paymentId',
            label: 'Payment',
            render: (p) => (
              <div>
                <p className="font-mono text-xs font-bold text-white">{p.paymentId}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{p.date ? new Date(p.date).toLocaleDateString('en-IN') : '—'}</p>
              </div>
            ),
          },
          { key: 'bookingId', label: 'Booking', render: (p) => <span className="font-mono text-xs text-slate-400">{p.bookingId}</span> },
          { key: 'customerName', label: 'Customer', render: (p) => <span className="font-semibold text-white">{p.customerName || '—'}</span> },
          { key: 'amount', label: 'Amount', render: (p) => <span className="font-bold text-emerald-400">₹{(p.amount ?? 0).toLocaleString('en-IN')}</span> },
          { key: 'method', label: 'Method', render: (p) => <span className="text-xs uppercase text-slate-400">{p.method || '—'}</span> },
          {
            key: 'status',
            label: 'Status',
            render: (p) => (
              <Badge color={p.status === 'received' ? 'green' : p.status === 'refunded' ? 'rose' : 'amber'}>
                {p.status || 'pending'}
              </Badge>
            ),
          },
          { key: 'transactionId', label: 'Txn ID', render: (p) => <span className="max-w-[140px] truncate text-xs text-slate-500">{p.transactionId || '—'}</span> },
        ]}
        fetchUrl={(page, q) => `/api/payments?q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search payment, booking, customer…"
        emptyTitle="No payments recorded"
        emptyHint="Payments are recorded automatically with bookings, or add manually."
        actions={(p) => (
          <button onClick={() => setToDelete(p)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      />
      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          const res = await fetch(`/api/payments/${toDelete._id}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Payment deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete payment?"
        message={`${toDelete?.paymentId} — ₹${(toDelete?.amount ?? 0).toLocaleString('en-IN')}`}
      />
    </div>
  )
}
