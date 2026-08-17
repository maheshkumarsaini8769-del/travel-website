import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import {
  analyticsEventsCollection,
  bookingsCollection,
  leadsCollection,
  customersCollection,
  paymentsCollection,
  auditLogsCollection,
} from '@/lib/db'
import { parseListParams, regexEscape } from '@/lib/util'

const TYPES = ['bookings', 'leads', 'customers', 'payments', 'events', 'audit'] as const
type ReportType = (typeof TYPES)[number]

function csvEscape(v: unknown): string {
  const s = v === undefined || v === null ? '' : String(v)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(csvEscape).join(',')]
  for (const row of rows) lines.push(row.map(csvEscape).join(','))
  return '\uFEFF' + lines.join('\r\n')
}

export async function GET(req: NextRequest, ctx: { params: { type: string } }) {
  const type = ctx.params.type as ReportType
  if (!TYPES.includes(type)) return Response.json({ error: 'Unknown report type' }, { status: 404 })
  const denied = await requireAdmin('reports.view')
  if (denied) return denied

  const url = req.nextUrl
  const { from, to } = parseListParams(url)
  const status = url.searchParams.get('status')

  try {
    let headers: string[] = []
    let rows: unknown[][] = []
    const dateFilter = from || to ? { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) } : undefined

    if (type === 'bookings') {
      const filter: Record<string, unknown> = {}
      if (dateFilter) filter.createdAt = dateFilter
      if (status) filter.status = status
      const docs = await bookingsCollection().then((c) => c.find(filter).sort({ createdAt: -1 }).toArray())
      headers = ['Booking ID', 'Customer', 'Phone', 'Email', 'Package', 'Travel Date', 'Travellers', 'Total (INR)', 'Paid (INR)', 'Pending (INR)', 'Payment Status', 'Status', 'Source', 'Created']
      rows = docs.map((d) => [
        d.bookingId,
        d.customer.name,
        d.customer.phone,
        d.customer.email ?? '',
        d.packageRef?.name ?? '',
        d.travelDate ?? '',
        d.travellers,
        d.totalAmount,
        d.paidAmount,
        Math.max(0, d.totalAmount - d.paidAmount),
        d.paymentStatus,
        d.status,
        d.source,
        new Date(d.createdAt).toLocaleString('en-IN'),
      ])
    } else if (type === 'leads') {
      const filter: Record<string, unknown> = {}
      if (dateFilter) filter.createdAt = dateFilter
      if (status) filter.status = status
      const docs = await leadsCollection().then((c) => c.find(filter).sort({ createdAt: -1 }).toArray())
      headers = ['Name', 'Phone', 'Email', 'Destination', 'Requirement', 'Travellers', 'Budget (INR)', 'Source', 'Status', 'Assigned To', 'Follow-up', 'Created']
      rows = docs.map((d) => [
        d.name,
        d.phone,
        d.email ?? '',
        d.destination ?? '',
        d.requirement ?? '',
        d.travellers ?? '',
        d.budget ?? '',
        d.source ?? '',
        d.status,
        d.assignedTo ?? '',
        d.followUpDate ? new Date(d.followUpDate).toLocaleDateString('en-IN') : '',
        new Date(d.createdAt).toLocaleString('en-IN'),
      ])
    } else if (type === 'customers') {
      const docs = await customersCollection().then((c) => c.find().sort({ createdAt: -1 }).toArray())
      headers = ['Name', 'Phone', 'Email', 'Source', 'Created']
      rows = docs.map((d) => [d.name, d.phone, d.email ?? '', d.source ?? '', new Date(d.createdAt).toLocaleString('en-IN')])
    } else if (type === 'payments') {
      const filter: Record<string, unknown> = {}
      if (dateFilter) filter.date = dateFilter
      if (status) filter.status = status
      const docs = await paymentsCollection().then((c) => c.find(filter).sort({ date: -1 }).toArray())
      headers = ['Payment ID', 'Booking', 'Customer', 'Amount (INR)', 'Method', 'Status', 'Transaction ID', 'Date', 'Notes']
      rows = docs.map((d) => [
        d.paymentId,
        d.bookingId,
        d.customerName,
        d.amount,
        d.method,
        d.status,
        d.transactionId ?? '',
        new Date(d.date).toLocaleString('en-IN'),
        d.notes ?? '',
      ])
    } else if (type === 'events') {
      const filter: Record<string, unknown> = {}
      if (dateFilter) filter.timestamp = dateFilter
      if (status) filter.eventName = status
      const docs = await analyticsEventsCollection().then((c) => c.find(filter).sort({ timestamp: -1 }).limit(10000).toArray())
      headers = ['Event', 'Page', 'Package', 'Search', 'Results', 'Device', 'Browser', 'OS', 'Source', 'Timestamp']
      rows = docs.map((d) => [
        d.eventName,
        d.page ?? '',
        d.packageId ?? '',
        d.searchQuery ?? '',
        d.resultCount ?? '',
        d.deviceType ?? '',
        d.browser ?? '',
        d.os ?? '',
        d.trafficSource ?? '',
        new Date(d.timestamp).toLocaleString('en-IN'),
      ])
    } else if (type === 'audit') {
      const filter: Record<string, unknown> = {}
      if (dateFilter) filter.timestamp = dateFilter
      const docs = await auditLogsCollection().then((c) => c.find(filter).sort({ timestamp: -1 }).limit(10000).toArray())
      headers = ['Admin', 'Action', 'Resource', 'Resource ID', 'Metadata', 'Timestamp']
      rows = docs.map((d) => [d.admin, d.action, d.resource, d.resourceId ?? '', d.metadata ?? '', new Date(d.timestamp).toLocaleString('en-IN')])
    }

    return new Response(toCsv(headers, rows), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="sunsky-${type}-${Date.now()}.csv"`,
      },
    })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
