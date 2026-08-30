'use client'

import { useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, PageHeader } from '@/components/admin/ui'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  bookingCount: number
  totalSpent: number
  pendingPayment: number
  lastContactedAt?: number
  createdAt?: number
}

export default function AdminCustomers() {
  const [focused, setFocused] = useState<Customer | null>(null)
  return (
    <div>
      <PageHeader title="Customers" subtitle="Every person who enquired or booked — with their spend" />
      <DataTable<Customer>
        columns={[
          {
            key: 'name',
            label: 'Customer',
            render: (c) => (
              <div>
                <p className="font-semibold text-white">{c.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{c.phone}</p>
              </div>
            ),
          },
          { key: 'email', label: 'Email', render: (c) => <span className="max-w-[180px] truncate text-slate-400">{c.email || '—'}</span> },
          { key: 'bookingCount', label: 'Bookings', render: (c) => <span className="font-semibold text-slate-200">{c.bookingCount}</span> },
          { key: 'totalSpent', label: 'Total spent', render: (c) => <span className="font-semibold text-emerald-400">₹{(c.totalSpent ?? 0).toLocaleString('en-IN')}</span> },
          {
            key: 'pendingPayment',
            label: 'Pending',
            render: (c) => <span className={c.pendingPayment > 0 ? 'font-semibold text-amber-400' : 'text-slate-500'}>{c.pendingPayment > 0 ? `₹${(c.pendingPayment ?? 0).toLocaleString('en-IN')}` : '—'}</span>,
          },
          { key: 'createdAt', label: 'Customer since', render: (c) => <span className="text-xs text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}</span> },
        ]}
        fetchUrl={(page, q) => `/api/customers?q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search name, phone, email…"
        emptyTitle="No customers yet"
        emptyHint="Customers are created automatically from enquiries and bookings."
        actions={(c) => (
          <div className="flex gap-1.5">
            <a href={`https://wa.me/${c.phone.replace('+', '')}`} target="_blank" rel="noreferrer" title="WhatsApp" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400 transition-colors hover:bg-emerald-500/20">
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
            <a href={`tel:${c.phone}`} title="Call" className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white">
              <Phone className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      />
    </div>
  )
}
