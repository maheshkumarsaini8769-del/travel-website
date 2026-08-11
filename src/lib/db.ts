import { MongoClient, type Db } from 'mongodb'
import type { TravelPackage } from '@/data/packages'

const uri = process.env.MONGODB_URI ?? ''
const DB_NAME = 'sunsky'

let client: MongoClient | null = null
let dbPromise: Promise<Db> | null = null

export function getDb(): Promise<Db> {
  if (!uri) throw new Error('MONGODB_URI is not set')
  if (!dbPromise) {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    dbPromise = client.connect().then((c) => c.db(DB_NAME))
  }
  return dbPromise
}

export interface PackageDoc extends TravelPackage {
  _id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ImageDoc {
  _id: import('mongodb').ObjectId
  mime: string
  size: number
  data: Buffer
  name: string
}

export function packagesCollection() {
  return getDb().then((db) => db.collection<PackageDoc>('packages'))
}

export function imagesCollection() {
  return getDb().then((db) => db.collection<ImageDoc>('images'))
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    dbPromise = null
  }
}