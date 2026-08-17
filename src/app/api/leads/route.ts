import { NextRequest } from 'next/server'
import { requireAdmin, getCurrentAdmin, audit } from '@/lib/auth'
import { leadsCollection, customersCollection } from '@/lib/db'
import { notify } from '@/lib/notify'
import { asString, asOptionalString, asNumber, asPhone, parseListParams, regexEscape } from '@/lib/util'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/db'

export function sanitizeLead(body: Record<string, unknown>) {
  return {
    name: asString(body?.name, 120),
    phone: asPhone(body?.phone),
    email: asOptionalString(body?.email, 200),
    requirement: asOptionalString(body?.requirement, 2000),
    destination: asOptionalString(body?.destination, 100),
    travelDate: asOptionalString(body?.travelDate, 20),
    travellers: Math.max(1, Math.round(asNumber(body.travellers, 1))),
    budget: asNumber(body.budget) > 0 ? Math.round(asNumber(body.budget)) : undefined,
    source: asOptionalString(body?.source, 100),
    notes: asOptionalString(body?.notes, 2000),
    followUpDate: asNumber(body.followUpDate) > 0 ? Math.round(asNumber(body.followUpDate)) : undefined,
  }
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('leads.view')
  if (denied) return denied

  const { page, limit, q, from, to } = parseListParams(req.nextUrl)
  const status = req.nextUrl.searchParams.get('status')
  try {
    const col = await leadsCollection()
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (from || to) {
      filter.createdAt = {}
      if (from) (filter.createdAt as Record<string, unknown>).$gte = from
      if (to) (filter.createdAt as Record<string, unknown>).$lte = to
    }
    if (q) {
      const rx = new RegExp(regexEscape(q), 'i')
      filter.$or = [{ name: rx }, { phone: rx }, { email: rx }, { requirement: rx }, { destination: rx }]
    }
    const [items, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ])
    return Response.json({ items, total })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  // Public endpoint — enquiry/contact form and plan-your-trip form
  try {
    const body = await req.json()
    const lead = sanitizeLead(body)
    if (!lead.name || !lead.phone) {
      return Response.json({ error: 'Name and phone number are required' }, { status: 400 })
    }
    if (lead.name.length < 2 || !/^[\w\s.'-]+$/.test(lead.name)) {
      return Response.json({ error: 'Please enter a valid name' }, { status: 400 })
    }
    if (lead.phone.length < 10) {
      return Response.json({ error: 'Please enter a valid phone number' }, { status: 400 })
    }

    const col = await leadsCollection()
    const now = Date.now()
    await col.insertOne({
      ...lead,
      _id: crypto.randomUUID(),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    })

    await customersCollection().then((c) =>
      c.updateOne(
        { phone: lead.phone },
        {
          $set: { name: lead.name, email: lead.email ?? '', updatedAt: now },
          $setOnInsert: { _id: crypto.randomUUID(), phone: lead.phone, source: lead.source, createdAt: now },
        },
        { upsert: true }
      )
    )

    void notify(
      'enquiry',
      'New enquiry',
      `${lead.name} — ${lead.destination ?? 'General enquiry'}`,
      '/admin/leads'
    )
    return Response.json({ ok: true }, { status: 201 })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
