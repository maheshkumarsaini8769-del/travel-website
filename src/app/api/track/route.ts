import { NextRequest } from 'next/server'
import { createHash } from 'crypto'
import { analyticsEventsCollection, sessionsCollection, ensureIndexesOnce } from '@/lib/db'

const VALID_EVENT = /^[A-Z_]{2,40}$/

function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!ua) return 'unknown'
  if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobi|iphone|ipod|android/i.test(ua)) return 'mobile'
  return 'desktop'
}

function detectBrowser(ua: string): string {
  if (!ua) return 'unknown'
  if (/edg\//i.test(ua)) return 'Edge'
  if (/opr\//i.test(ua)) return 'Opera'
  if (/chrome|crios/i.test(ua)) return 'Chrome'
  if (/firefox|fxios/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua)) return 'Safari'
  return 'other'
}

function detectOs(ua: string): string {
  if (!ua) return 'unknown'
  if (/windows/i.test(ua)) return 'Windows'
  if (/android/i.test(ua)) return 'Android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS'
  if (/mac os x/i.test(ua)) return 'macOS'
  if (/linux/i.test(ua)) return 'Linux'
  return 'other'
}

function detectSource(referrer: string | undefined, utm: Record<string, unknown> | undefined): 'direct' | 'google' | 'social' | 'referral' | 'campaign' | 'other' {
  if (utm && (utm.medium === 'cpc' || utm.source || utm.campaign)) return 'campaign'
  if (!referrer) return 'direct'
  const host = new URL(referrer).hostname.toLowerCase()
  if (/google\.|bing\.|yahoo\.|duckduckgo\./i.test(host)) return 'google'
  if (/facebook\.|instagram\.|whatsapp\.|youtube\.|twitter\.|x\.com|linkedin\./i.test(host)) return 'social'
  return 'referral'
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const eventName = String(body?.eventName ?? '').trim()
  if (!VALID_EVENT.test(eventName)) {
    return Response.json({ error: 'Invalid event name' }, { status: 400 })
  }

  ensureIndexesOnce()

  const ua = req.headers.get('user-agent') ?? ''
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  const referrer = body?.referrer ? String(body.referrer).slice(0, 500) : undefined
  const utmRaw = body?.utm && typeof body.utm === 'object' ? (body.utm as Record<string, unknown>) : undefined
  const utm = utmRaw
    ? {
        source: String(utmRaw.source ?? '').slice(0, 100) || undefined,
        medium: String(utmRaw.medium ?? '').slice(0, 100) || undefined,
        campaign: String(utmRaw.campaign ?? '').slice(0, 100) || undefined,
        term: String(utmRaw.term ?? '').slice(0, 100) || undefined,
        content: String(utmRaw.content ?? '').slice(0, 100) || undefined,
      }
    : undefined
  const hasUtm = utm && (utm.source || utm.medium || utm.campaign)

  const event = {
    _id: crypto.randomUUID(),
    eventName,
    sessionId: body?.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
    visitorId: body?.visitorId ? String(body.visitorId).slice(0, 64) : undefined,
    page: body?.page ? String(body.page).slice(0, 255) : undefined,
    packageId: body?.packageId ? String(body.packageId).slice(0, 100) : undefined,
    searchQuery: body?.searchQuery ? String(body.searchQuery).slice(0, 200) : undefined,
    resultCount: Number.isFinite(Number(body?.resultCount)) ? Math.max(0, Math.round(Number(body.resultCount))) : undefined,
    selectedSlug: body?.selectedSlug ? String(body.selectedSlug).slice(0, 200) : undefined,
    deviceType: detectDevice(ua),
    browser: detectBrowser(ua),
    os: detectOs(ua),
    trafficSource: detectSource(referrer, hasUtm ? (utm as Record<string, unknown>) : undefined),
    utm,
    country: req.headers.get('x-vercel-ip-country') ?? undefined,
    ipHash: ip ? createHash('sha256').update(ip).digest('hex').slice(0, 24) : undefined,
    metadata: body?.metadata && typeof body.metadata === 'object' ? (body.metadata as Record<string, unknown>) : undefined,
    timestamp: Date.now(),
  }

  try {
    await Promise.all([
      analyticsEventsCollection().then((c) => c.insertOne(event)),
      event.sessionId
        ? sessionsCollection().then((c) =>
            c.updateOne(
              { _id: event.sessionId! },
              {
                $set: {
                  lastActivityAt: event.timestamp,
                  ...(event.deviceType ? { deviceType: event.deviceType } : {}),
                  ...(event.trafficSource ? { trafficSource: event.trafficSource } : {}),
                },
                $inc: { pageCount: 1 },
                $setOnInsert: {
                  visitorId: event.visitorId ?? 'anon',
                  startedAt: event.timestamp,
                  createdAt: event.timestamp,
                  entryPage: event.page,
                },
              },
              { upsert: true }
            )
          )
        : Promise.resolve(),
    ])
    return Response.json({ ok: true }, { status: 201 })
  } catch {
    // Tracking must never break the visitor experience
    return Response.json({ ok: true }, { status: 201 })
  }
}
