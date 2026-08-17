// Client-side first-party analytics tracker. Safe to import from client components only.

const V_KEY = 'sunsky_visitor'
const S_KEY = 'sunsky_session'
const SESSION_TTL = 30 * 60 * 1000

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function sessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function getVisitorId(): string {
  const s = storage()
  if (!s) return 'anon'
  let id = s.getItem(V_KEY)
  if (!id) {
    id = crypto.randomUUID()
    s.setItem(V_KEY, id)
  }
  return id
}

export function getSessionId(): string {
  const s = storage()
  if (!s) return 'anon-session'
  const raw = s.getItem(S_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { id?: string; ts?: number }
      if (parsed.id && typeof parsed.ts === 'number' && Date.now() - parsed.ts < SESSION_TTL) {
        return parsed.id
      }
    } catch {
      // fall through and create a new session
    }
  }
  const id = crypto.randomUUID()
  s.setItem(S_KEY, JSON.stringify({ id, ts: Date.now() }))
  return id
}

function getReferrer(): string {
  const s = sessionStorage()
  if (!s) return ''
  const existing = s.getItem('sunsky_ref')
  if (existing) return existing
  const ref = typeof document !== 'undefined' ? document.referrer : ''
  if (ref) s.setItem('sunsky_ref', ref)
  return ref
}

function getUtm(): Record<string, string> | undefined {
  const s = sessionStorage()
  if (!s) return undefined
  const existing = s.getItem('sunsky_utm')
  if (existing) {
    try {
      return JSON.parse(existing) as Record<string, string>
    } catch {
      return undefined
    }
  }
  if (typeof window === 'undefined') return undefined
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['source', 'medium', 'campaign', 'term', 'content']) {
    const val = params.get(`utm_${key}`)
    if (val) utm[key] = val
  }
  if (Object.keys(utm).length) s.setItem('sunsky_utm', JSON.stringify(utm))
  return Object.keys(utm).length ? utm : undefined
}

export interface TrackData {
  page?: string
  packageId?: string
  searchQuery?: string
  resultCount?: number
  selectedSlug?: string
  metadata?: Record<string, unknown>
}

export function track(eventName: string, data?: TrackData): void {
  if (typeof window === 'undefined') return
  const payload = {
    eventName,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    page: data?.page ?? window.location.pathname,
    packageId: data?.packageId,
    searchQuery: data?.searchQuery,
    resultCount: data?.resultCount,
    selectedSlug: data?.selectedSlug,
    metadata: data?.metadata,
    referrer: getReferrer(),
    utm: getUtm(),
  }
  try {
    navigator.sendBeacon('/api/track', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  } catch {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }
}

export const trackPageView = (page: string) => track('PAGE_VIEW', { page })
export const trackSearch = (query: string, resultCount: number, selectedSlug?: string) =>
  track('SEARCH', { searchQuery: query, resultCount, selectedSlug })
export const trackPackageView = (packageId: string, metadata?: Record<string, unknown>) =>
  track('PACKAGE_VIEW', { packageId, metadata })
export const trackCTA = (cta: string, extra?: Record<string, unknown>) =>
  track('CTA_CLICK', { metadata: { cta, ...extra } })
export const trackWhatsAppClick = (extra?: Record<string, unknown>) => track('WHATSAPP_CLICK', { metadata: extra })
export const trackCallClick = () => track('CALL_CLICK')
export const trackEmailClick = () => track('EMAIL_CLICK')
export const trackEnquirySubmit = (extra?: Record<string, unknown>) => track('ENQUIRY_SUBMIT', { metadata: extra })
export const trackBookingStart = (extra?: Record<string, unknown>) => track('BOOKING_START', { metadata: extra })
export const trackBookingSubmit = (extra?: Record<string, unknown>) => track('BOOKING_SUBMIT', { metadata: extra })
export const trackNavClick = (label: string) => track('NAV_CLICK', { metadata: { label } })
