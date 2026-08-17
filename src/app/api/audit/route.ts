import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { auditLogsCollection } from '@/lib/db'
import { parseListParams, regexEscape } from '@/lib/util'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('audit.view')
  if (denied) return denied
  const { page, limit, q, from, to } = parseListParams(req.nextUrl)
  try {
    const col = await auditLogsCollection()
    const filter: Record<string, unknown> = {}
    if (from || to) {
      filter.timestamp = {}
      if (from) (filter.timestamp as Record<string, unknown>).$gte = from
      if (to) (filter.timestamp as Record<string, unknown>).$lte = to
    }
    if (q) {
      const rx = new RegExp(regexEscape(q), 'i')
      filter.$or = [{ admin: rx }, { action: rx }, { resource: rx }]
    }
    const [items, total] = await Promise.all([
      col.find(filter).sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ])
    return Response.json({ items, total })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}