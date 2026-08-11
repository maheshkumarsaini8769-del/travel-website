import { packages as staticPackages, type TravelPackage } from '@/data/packages'
import { packagesCollection, type PackageDoc } from './db'

function toPublic(doc: PackageDoc): TravelPackage {
  const { _id, createdAt, updatedAt, ...rest } = doc
  void _id
  void createdAt
  void updatedAt
  return rest
}

export async function getPackages(): Promise<TravelPackage[]> {
  try {
    const col = await packagesCollection()
    const docs = await col.find().toArray()
    const byId = new Map<string, TravelPackage>()
    for (const p of staticPackages) byId.set(p.id, p)
    for (const d of docs) byId.set(d.id, toPublic(d))
    return [...byId.values()]
  } catch {
    return staticPackages
  }
}

export async function getPackageById(id: string): Promise<TravelPackage | null> {
  try {
    const col = await packagesCollection()
    const doc = await col.findOne({ _id: id })
    if (doc) return toPublic(doc)
  } catch {
    // fall through to static
  }
  return staticPackages.find((p) => p.id === id) ?? null
}

export async function listDatabasePackages(): Promise<TravelPackage[]> {
  const col = await packagesCollection()
  const docs = await col.find().toArray()
  return docs.map(toPublic)
}