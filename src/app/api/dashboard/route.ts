import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { analyticsEventsCollection, bookingsCollection, leadsCollection, paymentsCollection, sessionsCollection, packagesCollection } from '@/lib/db'
import { packages as staticPackages } from '@/data/packages'
import { getInventory, type InventoryItem } from '@/lib/inventory'

interface Range {
  from: number
  to: number
  prevFrom: number
  prevTo: number
  label: string
}

function dayStart(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function resolveRange(url: URL): Range {
  const raw = url.searchParams.get('range') ?? '30d'
  const to = Date.now()
  const startOfDay = dayStart(to)
  const rangeMap: Record<string, Range> = {
    today: { from: startOfDay, to, prevFrom: startOfDay - 86_400_000, prevTo: startOfDay, label: 'Today' },
    '7d': { from: startOfDay - 6 * 86_400_000, to, prevFrom: startOfDay - 13 * 86_400_000, prevTo: startOfDay - 7 * 86_400_000, label: 'Last 7 days' },
    '30d': { from: startOfDay - 29 * 86_400_000, to, prevFrom: startOfDay - 59 * 86_400_000, prevTo: startOfDay - 30 * 86_400_000, label: 'Last 30 days' },
    '90d': { from: startOfDay - 89 * 86_400_000, to, prevFrom: startOfDay - 179 * 86_400_000, prevTo: startOfDay - 90 * 86_400_000, label: 'Last 90 days' },
    month: { from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), to, prevFrom: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime(), prevTo: startOfDay, label: 'This month' },
  }
  if (raw === 'custom') {
    const from = Number(url.searchParams.get('from'))
    const toRaw = Number(url.searchParams.get('to'))
    const customTo = Number.isFinite(toRaw) && toRaw > 0 ? toRaw : to
    const customFrom = Number.isFinite(from) && from > 0 ? from : startOfDay - 29 * 86_400_000
    const span = customTo - customFrom
    return {
      from: customFrom,
      to: customTo,
      prevFrom: customFrom - span,
      prevTo: customFrom,
      label: 'Custom range',
    }
  }
  return rangeMap[raw] ?? rangeMap['30d']
}

async function getEvents(from: number, to: number) {
  try {
    const col = await analyticsEventsCollection()
    return await col
      .find({ timestamp: { $gte: from, $lte: to } })
      .project({ eventName: 1, timestamp: 1, visitorId: 1, packageId: 1, searchQuery: 1, resultCount: 1, deviceType: 1, browser: 1, os: 1, trafficSource: 1 })
      .toArray()
  } catch {
    return []
  }
}

function pct(cur: number, prev: number): number | null {
  if (prev === 0) return cur > 0 ? null : 0
  return Math.round(((cur - prev) / prev) * 1000) / 10
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin('dashboard.view')
  if (denied) return denied

  const range = resolveRange(req.nextUrl)
  const startOfDay = dayStart(Date.now())

  const bookingsAgg = bookingsCollection().then((c) => c.find({ createdAt: { $gte: range.from, $lte: range.to } }).project({ status: 1, totalAmount: 1, paidAmount: 1, createdAt: 1, packageRef: 1 }).toArray()).catch(() => [])
  const prevBookingsAgg = bookingsCollection().then((c) => c.find({ createdAt: { $gte: range.prevFrom, $lte: range.prevTo } }).project({ status: 1 }).toArray()).catch(() => [])

  const [cur, prev, bookings, prevBookings, leads, prevLeads, payments, prevPayments, sessions, dbPackages, inventory] = await Promise.all([
    getEvents(range.from, range.to),
    getEvents(range.prevFrom, range.prevTo),
    bookingsAgg,
    prevBookingsAgg,
    leadsCollection().then((c) => c.countDocuments({ createdAt: { $gte: range.from, $lte: range.to } })).catch(() => 0),
    leadsCollection().then((c) => c.countDocuments({ createdAt: { $gte: range.prevFrom, $lte: range.prevTo } })).catch(() => 0),
    paymentsCollection().then((c) => c.find({ status: 'received', date: { $gte: range.from, $lte: range.to } }).project({ amount: 1, date: 1 }).toArray()).catch(() => []),
    paymentsCollection().then((c) => c.find({ status: 'received', date: { $gte: range.prevFrom, $lte: range.prevTo } }).project({ amount: 1 }).toArray()).catch(() => []),
    sessionsCollection().then((c) => c.countDocuments({ lastActivityAt: { $gte: range.from, $lte: range.to } })).catch(() => 0),
    packagesCollection().then((c) => c.find().project({ _id: 1, name: 1 }).toArray()).catch(() => []),
    getInventory(),
  ])

  // ---- Aggregations over events ----
  const uniqueVisitors = new Set<string>()
  const prevUnique = new Set<string>()
  const pageViews = { cur: 0, prev: 0 }
  const clicks = { cur: 0, prev: 0 }
  const searches = { cur: 0, prev: 0 }
  const packageViews = { cur: 0, prev: 0 }
  const whatsappClicks = { cur: 0, prev: 0 }

  const pkgViews: Record<string, number> = {}
  const pkgBookClicks: Record<string, number> = {}
  const pkgWhatsApp: Record<string, number> = {}
  const searchStats = new Map<string, { count: number; withResults: number; zeroResults: number }>()
  const deviceCount = new Map<string, number>()
  const browserCount = new Map<string, number>()
  const osCount = new Map<string, number>()
  const sourceCount = new Map<string, number>()

  const countByDevice = (events: typeof cur, map: Map<string, number>) => {
    for (const e of events) {
      if (e.deviceType) map.set(String(e.deviceType), (map.get(String(e.deviceType)) ?? 0) + 1)
    }
  }

  for (const e of cur) {
    const name = e.eventName
    if (e.visitorId) uniqueVisitors.add(e.visitorId)
    if (name === 'PAGE_VIEW') {
      pageViews.cur++
      if (e.packageId) {
        pkgViews[e.packageId] = (pkgViews[e.packageId] ?? 0) + 1
        packageViews.cur++
      }
    } else if (name === 'CTA_CLICK' || name === 'NAV_CLICK' || name === 'CALL_CLICK' || name === 'EMAIL_CLICK') {
      clicks.cur++
      if (e.packageId) pkgBookClicks[e.packageId] = (pkgBookClicks[e.packageId] ?? 0) + 1
    } else if (name === 'SEARCH') {
      searches.cur++
      const q = String(e.searchQuery ?? '').trim().toLowerCase() || '(empty)'
      const entry = searchStats.get(q) ?? { count: 0, withResults: 0, zeroResults: 0 }
      entry.count++
      if ((e.resultCount ?? 0) > 0) entry.withResults++
      else entry.zeroResults++
      searchStats.set(q, entry)
    } else if (name === 'WHATSAPP_CLICK') {
      whatsappClicks.cur++
      if (e.packageId) pkgWhatsApp[e.packageId] = (pkgWhatsApp[e.packageId] ?? 0) + 1
    } else if (name === 'PACKAGE_VIEW') {
      packageViews.cur++
      if (e.packageId) pkgViews[e.packageId] = (pkgViews[e.packageId] ?? 0) + 1
    }
  }
  for (const e of prev) {
    if (e.visitorId) prevUnique.add(e.visitorId)
    if (e.eventName === 'PAGE_VIEW') pageViews.prev++
    else if (e.eventName === 'CTA_CLICK' || e.eventName === 'NAV_CLICK' || e.eventName === 'CALL_CLICK' || e.eventName === 'EMAIL_CLICK') clicks.prev++
    else if (e.eventName === 'SEARCH') searches.prev++
    else if (e.eventName === 'WHATSAPP_CLICK') whatsappClicks.prev++
    else if (e.eventName === 'PACKAGE_VIEW') packageViews.prev++
  }

  countByDevice(cur, deviceCount)
  for (const e of cur) {
    if (e.browser) browserCount.set(String(e.browser), (browserCount.get(String(e.browser)) ?? 0) + 1)
    if (e.os) osCount.set(String(e.os), (osCount.get(String(e.os)) ?? 0) + 1)
    if (e.trafficSource) sourceCount.set(String(e.trafficSource), (sourceCount.get(String(e.trafficSource)) ?? 0) + 1)
  }

  // ---- Bookings / revenue ----
  const confirmed = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'in-progress').length
  const pendingOrders = bookings.filter((b) => b.status === 'pending').length
  const cancelled = bookings.filter((b) => b.status === 'cancelled' || b.status === 'refunded').length
  const prevConfirmed = prevBookings.filter((b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'in-progress').length
  const prevPending = prevBookings.filter((b) => b.status === 'pending').length
  const revenue = payments.reduce((s, p) => s + p.amount, 0)
  const prevRevenue = prevPayments.reduce((s, p) => s + p.amount, 0)
  const pendingPayments = bookings.reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount), 0)
  const completedBookings = bookings.filter((b) => b.status === 'completed')
  const completedPayments = completedBookings.reduce((s, b) => s + (b.paidAmount ?? 0), 0)

  const pkgBookings: Record<string, { bookings: number; revenue: number }> = {}
  for (const b of bookings) {
    const pid = b.packageRef?.id
    if (pid) {
      const entry = pkgBookings[pid] ?? { bookings: 0, revenue: 0 }
      entry.bookings++
      entry.revenue += b.paidAmount
      pkgBookings[pid] = entry
    }
  }

  // ---- Package name map ----
  const pkgName = new Map<string, string>()
  for (const p of staticPackages) pkgName.set(p.id, p.name)
  for (const d of dbPackages) if (d.name) pkgName.set(d._id, d.name)

  const topPackages = Object.keys(pkgViews)
    .map((pid) => {
      const pkg = staticPackages.find((p) => p.id === pid)
      const bookingsCount = pkgBookings[pid]?.bookings ?? 0
      const revenue = pkgBookings[pid]?.revenue ?? 0
      const costPerPerson = pkg?.cost ?? 0
      const totalCost = costPerPerson * bookingsCount
      return {
        id: pid,
        name: pkgName.get(pid) ?? pid,
        views: pkgViews[pid] ?? 0,
        bookClicks: pkgBookClicks[pid] ?? 0,
        whatsapp: pkgWhatsApp[pid] ?? 0,
        bookings: bookingsCount,
        revenue,
        cost: totalCost,
        profit: revenue - totalCost,
        costPerPerson,
      }
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  const topSearches = [...searchStats.entries()]
    .map(([query, s]) => ({ query, count: s.count, withResults: s.withResults, zeroResults: s.zeroResults }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ---- Daily trend ----
  const days = Math.max(1, Math.ceil((range.to - range.from) / 86_400_000))
  const trend: { label: string; visitors: number; pageViews: number; bookings: number; revenue: number }[] = []
  const bookByDay = new Map<number, number>()
  const revByDay = new Map<number, number>()
  for (const b of bookings) {
    const d = dayStart(b.createdAt)
    bookByDay.set(d, (bookByDay.get(d) ?? 0) + 1)
  }
  for (const p of payments) {
    const d = dayStart(p.date)
    revByDay.set(d, (revByDay.get(d) ?? 0) + p.amount)
  }
  for (let i = 0; i < days; i++) {
    const start = range.from + i * 86_400_000
    const end = start + 86_400_000
    const visitors = new Set<string>()
    let pv = 0
    for (const e of cur) {
      if (e.timestamp >= start && e.timestamp < end) {
        if (e.visitorId) visitors.add(e.visitorId)
        if (e.eventName === 'PAGE_VIEW') pv++
      }
    }
    trend.push({
      label: new Date(start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      visitors: visitors.size,
      pageViews: pv,
      bookings: bookByDay.get(start) ?? 0,
      revenue: Math.round(revByDay.get(start) ?? 0),
    })
  }

  // ---- Live activity ----
  const live: { time: number; text: string; type: string }[] = []
  try {
    const recent = await analyticsEventsCollection()
      .then((c) => c.find({}).sort({ timestamp: -1 }).limit(14).project({ eventName: 1, timestamp: 1, packageId: 1, searchQuery: 1, metadata: 1 }).toArray())
    const nameFor = (pid?: string) => (pid ? pkgName.get(pid) ?? pid : '')
    for (const e of recent) {
      const t = e.timestamp
      switch (e.eventName) {
        case 'PACKAGE_VIEW':
          live.push({ time: t, text: `Visitor viewed ${nameFor(e.packageId)}`, type: 'view' })
          break
        case 'SEARCH':
          live.push({ time: t, text: `Visitor searched "${e.searchQuery}"`, type: 'search' })
          break
        case 'WHATSAPP_CLICK':
          live.push({ time: t, text: `Visitor clicked WhatsApp${e.packageId ? ` for ${nameFor(e.packageId)}` : ''}`, type: 'wa' })
          break
        case 'BOOKING_START':
          live.push({ time: t, text: `Visitor started booking ${nameFor(e.packageId)}`, type: 'book' })
          break
        case 'ENQUIRY_SUBMIT':
          live.push({ time: t, text: 'Visitor submitted an enquiry', type: 'enq' })
          break
        case 'CTA_CLICK':
          live.push({ time: t, text: `Visitor clicked ${String((e.metadata as Record<string, unknown>)?.cta ?? 'CTA')}`, type: 'click' })
          break
      }
    }
  } catch {
    // live feed is best-effort
  }

  const funnel = {
    visitors: sessions,
    packageViews: packageViews.cur,
    enquiries: leads,
    bookings: bookings.length,
    confirmed,
  }

  const kpis = {
    visitors: sessions,
    uniqueVisitors: uniqueVisitors.size,
    pageViews: pageViews.cur,
    clicks: clicks.cur,
    searches: searches.cur,
    packageViews: packageViews.cur,
    whatsappClicks: whatsappClicks.cur,
    enquiries: leads,
    bookings: bookings.length,
    confirmedBookings: confirmed,
    pendingOrders,
    cancelledBookings: cancelled,
    revenue,
    pendingPayments,
    completedPayments,
    deltas: {
      visitors: pct(sessions, 0) ?? (sessions > 0 ? null : 0),
      uniqueVisitors: pct(uniqueVisitors.size, prevUnique.size),
      pageViews: pct(pageViews.cur, pageViews.prev),
      clicks: pct(clicks.cur, clicks.prev),
      searches: pct(searches.cur, searches.prev),
      packageViews: pct(packageViews.cur, packageViews.prev),
      whatsappClicks: pct(whatsappClicks.cur, whatsappClicks.prev),
      enquiries: pct(leads, prevLeads),
      bookings: pct(bookings.length, prevBookings.length),
      confirmedBookings: pct(confirmed, prevConfirmed),
      pendingOrders: pct(pendingOrders, prevPending),
      revenue: pct(revenue, prevRevenue),
    },
  }

  // ---- Today ----
  const todayEvents = cur.filter((e) => e.timestamp >= startOfDay)
  const todayVisitors = new Set(todayEvents.map((e) => e.visitorId).filter(Boolean))
  const todayBookings = bookings.filter((b) => b.createdAt >= startOfDay)
  const todayRevenue = payments.filter((p) => p.date >= startOfDay).reduce((s, p) => s + p.amount, 0)
  const todayCost = todayBookings.reduce((s, b) => {
    const pid = b.packageRef?.id
    const pkg = staticPackages.find((p) => p.id === pid)
    return s + (pkg?.cost ?? 0) * (b.travellers || 1)
  }, 0)
  const todayCompletedBookings = todayBookings.filter((b) => b.status === 'completed')
  const todayCompletedPayments = todayCompletedBookings.reduce((s, b) => s + (b.paidAmount ?? 0), 0)
  const today = {
    visitors: todayVisitors.size,
    pageViews: todayEvents.filter((e) => e.eventName === 'PAGE_VIEW').length,
    searches: todayEvents.filter((e) => e.eventName === 'SEARCH').length,
    bookings: todayBookings.length,
    revenue: todayRevenue,
    cost: todayCost,
    profit: todayRevenue - todayCost,
    completedPayments: todayCompletedPayments,
  }

  return Response.json({
    range,
    kpis,
    today,
    trend,
    trafficSources: [...sourceCount.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
    devices: [...deviceCount.entries()].map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count),
    browsers: [...browserCount.entries()].map(([browser, count]) => ({ browser, count })).sort((a, b) => b.count - a.count),
    osList: [...osCount.entries()].map(([os, count]) => ({ os, count })).sort((a, b) => b.count - a.count),
    topPackages,
    topSearches,
    funnel,
    inventory,
    live: live.slice(0, 12),
  })
}
