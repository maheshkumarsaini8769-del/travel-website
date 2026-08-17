import { bookingsCollection, hotelsCollection, packagesCollection, settingsCollection, vehiclesCollection } from './db'
import { packages as staticPackages } from '@/data/packages'

export type ProductType = 'package' | 'hotel' | 'vehicle'

export interface InventoryItem {
  id: string
  type: ProductType
  name: string
  subtitle?: string
  limit: number
  sold: number | null
  left: number | null
}

export const INVENTORY_SETTING_KEY = 'inventory_limits'

export function parseLimits(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const n = Math.floor(Number(v))
    if (Number.isFinite(n) && n > 0) out[k] = n
  }
  return out
}

export async function getInventoryLimits(): Promise<Record<string, number>> {
  try {
    const col = await settingsCollection()
    const doc = await col.findOne({ _id: INVENTORY_SETTING_KEY })
    return parseLimits(doc?.value)
  } catch {
    return {}
  }
}

export async function saveInventoryLimits(limits: Record<string, number>): Promise<void> {
  const col = await settingsCollection()
  await col.updateOne({ _id: INVENTORY_SETTING_KEY }, { $set: { value: limits, updatedAt: Date.now() } }, { upsert: true })
}

const ACTIVE_STATUSES = ['pending', 'confirmed', 'in-progress', 'completed'] as const

export async function getInventory(): Promise<InventoryItem[]> {
  const limits = await getInventoryLimits()

  try {
    const [dbPkgs, hotels, vehicles, bookings] = await Promise.all([
      packagesCollection().then((c) => c.find().project({ _id: 1, name: 1, region: 1 }).toArray()).catch(() => []),
      hotelsCollection().then((c) => c.find().project({ _id: 1, name: 1, location: 1 }).toArray()).catch(() => []),
      vehiclesCollection().then((c) => c.find().project({ _id: 1, name: 1, type: 1 }).toArray()).catch(() => []),
      bookingsCollection()
        .then((c) => c.find({ status: { $in: ACTIVE_STATUSES } }).project({ packageRef: 1 }).toArray())
        .catch(() => []),
    ])

    const soldByPkg = new Map<string, number>()
    for (const b of bookings) {
      const pid = b.packageRef?.id
      if (pid) soldByPkg.set(pid, (soldByPkg.get(pid) ?? 0) + 1)
    }

    const items: InventoryItem[] = []

    const pkgIds = new Set<string>()
    for (const p of staticPackages) pkgIds.add(p.id)
    for (const p of dbPkgs) pkgIds.add(p._id)

    for (const id of pkgIds) {
      const db = dbPkgs.find((p) => p._id === id)
      const s = staticPackages.find((p) => p.id === id)
      const sold = soldByPkg.get(id) ?? 0
      const limit = limits[id] ?? 0
      items.push({
        id,
        type: 'package',
        name: db?.name ?? s?.name ?? id,
        subtitle: (db?.region ?? s?.region) as string | undefined,
        limit,
        sold,
        left: limit > 0 ? Math.max(0, limit - sold) : null,
      })
    }

    for (const h of hotels) {
      const limit = limits[`hotel:${h._id}`] ?? 0
      items.push({ id: h._id, type: 'hotel', name: h.name, subtitle: h.location, limit, sold: null, left: null })
    }
    for (const v of vehicles) {
      const limit = limits[`vehicle:${v._id}`] ?? 0
      items.push({ id: v._id, type: 'vehicle', name: v.name, subtitle: v.type, limit, sold: null, left: null })
    }

    return items
  } catch {
    return []
  }
}

export function stockStatus(item: InventoryItem): { label: string; color: string } {
  if (item.limit <= 0) return { label: 'Unlimited', color: 'slate' }
  if (item.sold === null || item.left === null) return { label: 'Manual stock', color: 'violet' }
  if (item.left <= 0) return { label: 'Sold out', color: 'rose' }
  if (item.left <= Math.ceil(item.limit * 0.25)) return { label: 'Low stock', color: 'amber' }
  return { label: 'In stock', color: 'green' }
}