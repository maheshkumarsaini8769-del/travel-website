import { MongoClient, type Db, type ObjectId } from 'mongodb'
import type { TravelPackage } from '@/data/packages'

const uri = process.env.MONGODB_URI ?? ''
const DB_NAME = 'sunsky'

let client: MongoClient | null = null
let dbPromise: Promise<Db> | null = null
let indexesDone = false

export function getDb(): Promise<Db> {
  if (!uri) throw new Error('MONGODB_URI is not set')
  if (!dbPromise) {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    dbPromise = client
      .connect()
      .then((c) => c.db(DB_NAME))
      .then((db) => {
        if (!indexesDone) {
          indexesDone = true
          void ensureIndexes(db)
        }
        return db
      })
  }
  return dbPromise
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    dbPromise = null
  }
}

async function ensureIndexes(db: Db): Promise<void> {
  try {
    await Promise.all([
      db.collection('analytics_events').createIndexes([
        { key: { timestamp: -1 } },
        { key: { eventName: 1, timestamp: -1 } },
        { key: { visitorId: 1 } },
        { key: { sessionId: 1 } },
        { key: { packageId: 1, timestamp: -1 } },
        { key: { searchQuery: 1 } },
      ]),
      db.collection('bookings').createIndexes([
        { key: { status: 1 } },
        { key: { createdAt: -1 } },
        { key: { 'customer.phone': 1 } },
        { key: { bookingId: 1 }, unique: true },
      ]),
      db.collection('leads').createIndexes([{ key: { status: 1 } }, { key: { createdAt: -1 } }, { key: { 'phone': 1 } }]),
      db.collection('customers').createIndexes([{ key: { phone: 1 } }, { key: { createdAt: -1 } }]),
      db.collection('payments').createIndexes([{ key: { bookingId: 1 } }, { key: { date: -1 } }]),
      db.collection('notifications').createIndexes([{ key: { read: 1, createdAt: -1 } }]),
      db.collection('audit_logs').createIndexes([{ key: { timestamp: -1 } }]),
      db.collection('reviews').createIndexes([{ key: { approved: 1, createdAt: -1 } }]),
      db.collection('packages').createIndexes([{ key: { updatedAt: -1 } }]),
      db.collection('destinations').createIndexes([{ key: { status: 1 } }]),
      db.collection('sessions').createIndexes([{ key: { lastActivityAt: -1 } }]),
    ])
  } catch {
    // indexes are best-effort; connection/whitelist issues must not break reads
  }
}

export function ensureIndexesOnce(): void {
  if (indexesDone || !uri) return
  indexesDone = true
  getDb().then(ensureIndexes).catch(() => {})
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PackageDoc extends TravelPackage {
  _id: string
  status?: 'draft' | 'published' | 'archived'
  availableDates?: string[]
  maxTravellers?: number
  seoTitle?: string
  seoDescription?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ImageDoc {
  _id: ObjectId
  mime: string
  size: number
  data: Buffer
  name: string
}

import type { AdminRole } from './roles'
export type { AdminRole } from './roles'
export { ROLE_LABELS, ROLE_PERMISSIONS } from './roles'

export interface AdminDoc {
  _id: string
  username: string
  passwordHash: string
  salt: string
  name: string
  role: AdminRole
  permissions: string[]
  active: boolean
  lastLoginAt?: number
  createdAt: number
}

export interface DestinationDoc {
  _id: string
  name: string
  slug: string
  tagline?: string
  description: string
  image: string
  gallery: string[]
  attractions: string[]
  bestTime?: string
  highlights: string[]
  categories: string[]
  packageIds: string[]
  seoTitle?: string
  seoDescription?: string
  status: 'draft' | 'published'
  featured: boolean
  createdAt: number
  updatedAt: number
}

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded'

export const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'refunded']

export interface BookingDoc {
  _id: string
  bookingId: string
  customer: { name: string; phone: string; email?: string }
  packageRef?: { id?: string; name: string }
  destination?: string
  travelDate?: string
  travellers: number
  adults: number
  children: number
  totalAmount: number
  paidAmount: number
  paymentStatus: PaymentStatus
  status: BookingStatus
  source: 'website' | 'whatsapp' | 'call' | 'walk-in' | 'admin'
  notes?: string
  createdAt: number
  updatedAt: number
}

export interface CustomerDoc {
  _id: string
  name: string
  phone: string
  email?: string
  notes?: string
  source?: string
  lastContactedAt?: number
  createdAt: number
  updatedAt: number
}

export type LeadStatus = 'new' | 'contacted' | 'follow-up' | 'interested' | 'converted' | 'lost'
export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'follow-up', 'interested', 'converted', 'lost']

export interface LeadDoc {
  _id: string
  name: string
  phone: string
  email?: string
  requirement?: string
  destination?: string
  travelDate?: string
  travellers?: number
  budget?: number
  source?: string
  status: LeadStatus
  assignedTo?: string
  notes?: string
  followUpDate?: number
  bookingId?: string
  createdAt: number
  updatedAt: number
}

export interface PaymentDoc {
  _id: string
  paymentId: string
  bookingId: string
  bookingLabel?: string
  customerName: string
  amount: number
  method: 'cash' | 'upi' | 'bank' | 'card' | 'other'
  status: 'pending' | 'received' | 'refunded' | 'failed'
  transactionId?: string
  notes?: string
  date: number
  createdAt: number
}

export interface HotelDoc {
  _id: string
  name: string
  location: string
  stars: number
  description?: string
  amenities: string[]
  roomTypes: { name: string; price: number; capacity: number; images?: string[] }[]
  images: string[]
  availability: boolean
  packageIds: string[]
  status: 'draft' | 'published'
  createdAt: number
  updatedAt: number
}

export interface VehicleDoc {
  _id: string
  name: string
  type: string
  registration?: string
  capacity: number
  driver?: string
  price: number
  availability: boolean
  status: 'active' | 'maintenance' | 'inactive'
  notes?: string
  createdAt: number
  updatedAt: number
}

export interface CouponDoc {
  _id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  minBookingValue?: number
  maxDiscount?: number
  expiry?: number
  usageLimit?: number
  perCustomerLimit?: number
  usedCount: number
  active: boolean
  createdAt: number
}

export interface ReviewDoc {
  _id: string
  name: string
  rating: number
  text: string
  phone?: string
  packageId?: string
  packageName?: string
  approved: boolean
  featured: boolean
  createdAt: number
  editedAt?: number
}

export interface NotificationDoc {
  _id: string
  type: 'booking' | 'enquiry' | 'payment' | 'review' | 'cancellation' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: number
}

export interface AuditLogDoc {
  _id: string
  admin: string
  action: string
  resource: string
  resourceId?: string
  metadata?: string
  timestamp: number
}

export interface AnalyticsEventDoc {
  _id: string
  eventName: string
  sessionId?: string
  visitorId?: string
  page?: string
  packageId?: string
  searchQuery?: string
  resultCount?: number
  selectedSlug?: string
  deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  browser?: string
  os?: string
  trafficSource?: 'direct' | 'google' | 'social' | 'referral' | 'campaign' | 'other'
  utm?: { source?: string; medium?: string; campaign?: string; term?: string; content?: string }
  country?: string
  ipHash?: string
  metadata?: Record<string, unknown>
  timestamp: number
}

export interface SessionDoc {
  _id: string
  visitorId: string
  startedAt: number
  lastActivityAt: number
  pageCount: number
  entryPage?: string
  deviceType?: string
  trafficSource?: string
  createdAt: number
}

export type SettingValue = string | number | boolean | Record<string, unknown> | unknown[]

export interface SettingDoc {
  _id: string
  value: SettingValue
  updatedAt: number
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export function packagesCollection() {
  return getDb().then((db) => db.collection<PackageDoc>('packages'))
}
export function imagesCollection() {
  return getDb().then((db) => db.collection<ImageDoc>('images'))
}
export function adminsCollection() {
  return getDb().then((db) => db.collection<AdminDoc>('admins'))
}
export function destinationsCollection() {
  return getDb().then((db) => db.collection<DestinationDoc>('destinations'))
}
export function bookingsCollection() {
  return getDb().then((db) => db.collection<BookingDoc>('bookings'))
}
export function customersCollection() {
  return getDb().then((db) => db.collection<CustomerDoc>('customers'))
}
export function leadsCollection() {
  return getDb().then((db) => db.collection<LeadDoc>('leads'))
}
export function paymentsCollection() {
  return getDb().then((db) => db.collection<PaymentDoc>('payments'))
}
export function hotelsCollection() {
  return getDb().then((db) => db.collection<HotelDoc>('hotels'))
}
export function vehiclesCollection() {
  return getDb().then((db) => db.collection<VehicleDoc>('vehicles'))
}
export function couponsCollection() {
  return getDb().then((db) => db.collection<CouponDoc>('coupons'))
}
export function reviewsCollection() {
  return getDb().then((db) => db.collection<ReviewDoc>('reviews'))
}
export function notificationsCollection() {
  return getDb().then((db) => db.collection<NotificationDoc>('notifications'))
}
export function auditLogsCollection() {
  return getDb().then((db) => db.collection<AuditLogDoc>('audit_logs'))
}
export function analyticsEventsCollection() {
  return getDb().then((db) => db.collection<AnalyticsEventDoc>('analytics_events'))
}
export function sessionsCollection() {
  return getDb().then((db) => db.collection<SessionDoc>('sessions'))
}
export function settingsCollection() {
  return getDb().then((db) => db.collection<SettingDoc>('settings'))
}
