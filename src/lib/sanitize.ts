import { asString, asOptionalString, asNumber, asStringArray, asBool, asPhone } from './util'
import type { HotelDoc, VehicleDoc, CouponDoc } from './db'

export function sanitizeBooking(body: Record<string, unknown>) {
  const cust = (body.customer ?? {}) as Record<string, unknown>
  const pkgRef = (body.packageRef ?? {}) as Record<string, unknown>
  const adults = Math.max(0, Math.round(asNumber(body.adults)))
  const children = Math.max(0, Math.round(asNumber(body.children)))
  return {
    customer: {
      name: asString(cust.name ?? body.name, 120),
      phone: asPhone(cust.phone ?? body.phone),
      email: asOptionalString(cust.email ?? body.email, 200),
    },
    packageRef: body.packageRef
      ? {
          id: asOptionalString(pkgRef.id, 100),
          name: asString(pkgRef.name, 200),
        }
      : {
          id: asOptionalString(body?.packageId, 100),
          name: asString(body?.packageName, 200),
        },
    destination: asOptionalString(body?.destination, 100),
    travelDate: asOptionalString(body?.travelDate, 20),
    travellers: Math.max(1, adults + children || Math.round(asNumber(body.travellers, 1))),
    adults: adults || Math.max(1, Math.round(asNumber(body.travellers, 1))),
    children,
    totalAmount: Math.max(0, asNumber(body.totalAmount)),
    paidAmount: Math.max(0, asNumber(body.paidAmount)),
    notes: asOptionalString(body?.notes, 2000),
  }
}

export function sanitizeHotel(body: Record<string, unknown>): Omit<HotelDoc, '_id' | 'createdAt' | 'updatedAt'> {
  return {
    name: asString(body.name, 150),
    location: asString(body.location, 150),
    stars: Math.min(5, Math.max(0, Math.round(asNumber(body.stars)))),
    description: asOptionalString(body.description, 5000),
    amenities: asStringArray(body.amenities),
    roomTypes: Array.isArray(body.roomTypes)
      ? (body.roomTypes as { name?: unknown; price?: unknown; capacity?: unknown; images?: unknown }[])
          .map((r) => ({
            name: asString(r.name, 100),
            price: Math.max(0, asNumber(r.price)),
            capacity: Math.max(1, Math.round(asNumber(r.capacity, 1))),
            images: asStringArray(r.images),
          }))
          .filter((r) => r.name)
      : [],
    images: asStringArray(body.images),
    availability: asBool(body.availability) || body.availability === undefined,
    packageIds: asStringArray(body.packageIds),
    status: (asString(body.status, 20) === 'draft' ? 'draft' : 'published') as HotelDoc['status'],
  }
}

export function sanitizeVehicle(body: Record<string, unknown>): Omit<VehicleDoc, '_id' | 'createdAt' | 'updatedAt'> {
  return {
    name: asString(body.name, 120),
    type: asString(body.type, 60),
    registration: asOptionalString(body.registration, 30),
    capacity: Math.max(1, Math.round(asNumber(body.capacity, 4))),
    driver: asOptionalString(body.driver, 100),
    price: Math.max(0, asNumber(body.price)),
    availability: asBool(body.availability) || body.availability === undefined,
    status: (asString(body.status, 20) === 'maintenance' ? 'maintenance' : asString(body.status, 20) === 'inactive' ? 'inactive' : 'active') as VehicleDoc['status'],
    notes: asOptionalString(body.notes, 1000),
  }
}

export function sanitizeCoupon(body: Record<string, unknown>): Omit<CouponDoc, '_id' | 'usedCount' | 'createdAt'> {
  return {
    code: asString(body.code, 30).toUpperCase(),
    type: (asString(body.type, 10) === 'fixed' ? 'fixed' : 'percent') as CouponDoc['type'],
    value: Math.max(0, asNumber(body.value)),
    minBookingValue: asNumber(body.minBookingValue) > 0 ? Math.round(asNumber(body.minBookingValue)) : undefined,
    maxDiscount: asNumber(body.maxDiscount) > 0 ? Math.round(asNumber(body.maxDiscount)) : undefined,
    expiry: asNumber(body.expiry) > 0 ? Math.round(asNumber(body.expiry)) : undefined,
    usageLimit: asNumber(body.usageLimit) > 0 ? Math.round(asNumber(body.usageLimit)) : undefined,
    perCustomerLimit: asNumber(body.perCustomerLimit) > 0 ? Math.round(asNumber(body.perCustomerLimit)) : undefined,
    active: asBool(body.active) || body.active === undefined,
  }
}
