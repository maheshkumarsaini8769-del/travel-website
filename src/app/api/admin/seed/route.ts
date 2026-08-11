import { requireAdmin } from '@/lib/auth'
import { packagesCollection } from '@/lib/db'
import { packages as staticPackages } from '@/data/packages'

export async function POST() {
  const denied = requireAdmin()
  if (denied) return denied

  try {
    const col = await packagesCollection()
    const now = new Date()
    let count = 0
    for (const pkg of staticPackages) {
      await col.updateOne(
        { _id: pkg.id },
        { $set: { ...pkg, updatedAt: now }, $setOnInsert: { createdAt: now } },
        { upsert: true }
      )
      count++
    }
    return Response.json({ ok: true, seeded: count })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}