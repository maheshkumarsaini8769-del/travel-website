import { NextRequest } from 'next/server'
import { audit, getCurrentAdmin, requireAdmin } from '@/lib/auth'
import { getInventory, saveInventoryLimits } from '@/lib/inventory'

export async function GET() {
  const denied = await requireAdmin('packages.view')
  if (denied) return denied
  const items = await getInventory()
  return Response.json({ items })
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin('packages.edit')
  if (denied) return denied
  try {
    const body = (await req.json()) as { limits?: Record<string, unknown> }
    const raw = body?.limits ?? {}
    const limits: Record<string, number> = {}
    for (const [k, v] of Object.entries(raw)) {
      const n = Math.floor(Number(v))
      if (Number.isFinite(n) && n >= 0 && n <= 1_000_000) limits[k] = n
    }
    await saveInventoryLimits(limits)
    const admin = await getCurrentAdmin()
    if (admin) void audit(admin.username, 'inventory.updated', 'inventory-limits', undefined, { count: Object.keys(limits).length })
    return Response.json({ ok: true, limits })
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }
}