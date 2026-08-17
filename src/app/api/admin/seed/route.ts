import { requireAdmin } from '@/lib/auth'
import { packagesCollection, destinationsCollection, settingsCollection } from '@/lib/db'
import { packages as staticPackages } from '@/data/packages'
import { destinations as staticDestinations } from '@/data/destinations'
import { defaultSettings } from '@/lib/settings'

export async function POST() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const now = new Date()
    let packages = 0
    for (const pkg of staticPackages) {
      await packagesCollection().then((c) =>
        c.updateOne(
          { _id: pkg.id },
          { $set: { ...pkg, updatedAt: now }, $setOnInsert: { createdAt: now } },
          { upsert: true }
        )
      )
      packages++
    }

    let destinations = 0
    const col = await destinationsCollection()
    for (const d of staticDestinations) {
      const existing = await col.findOne({ _id: d.id })
      const doc = {
        _id: d.id,
        slug: d.id,
        name: d.name,
        tagline: d.tagline,
        description: d.overview,
        image: d.image,
        gallery: d.gallery,
        attractions: d.popularPlaces,
        bestTime: d.bestTime,
        highlights: d.highlights,
        categories: [d.category],
        packageIds: [],
        status: 'published' as const,
        featured: false,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      }
      await col.updateOne({ _id: d.id }, { $set: doc }, { upsert: true })
      destinations++
    }

    let settings = 0
    const settingsCol = await settingsCollection()
    for (const [key, value] of Object.entries(defaultSettings)) {
      const existing = await settingsCol.findOne({ _id: key })
      if (!existing) {
        await settingsCol.insertOne({ _id: key, value, updatedAt: Date.now() })
        settings++
      }
    }

    return Response.json({ ok: true, seeded: { packages, destinations, settings } })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
