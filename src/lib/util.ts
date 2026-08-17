// Small shared sanitizers for API routes. Never trust frontend input.

export function asString(v: unknown, max = 1000): string {
  if (v === undefined || v === null) return ''
  return String(v).slice(0, max).trim()
}

export function asOptionalString(v: unknown, max = 1000): string | undefined {
  const s = asString(v, max)
  return s || undefined
}

export function asNumber(v: unknown, fallback = 0): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export function asBool(v: unknown): boolean {
  return v === true || v === 'true' || v === '1' || v === 'on'
}

export function asStringArray(v: unknown, maxItems = 50): string[] {
  if (Array.isArray(v)) {
    return v.map((x) => String(x).trim()).filter(Boolean).slice(0, maxItems)
  }
  if (typeof v === 'string' && v.trim()) {
    return v.split(',').map((x) => x.trim()).filter(Boolean).slice(0, maxItems)
  }
  return []
}

export function asPhone(v: unknown): string {
  return String(v ?? '').replace(/[^\d+]/g, '').slice(0, 16)
}

export function asDateMs(v: unknown): number | undefined {
  const n = Number(v)
  if (!Number.isFinite(n)) return undefined
  return n > 0 ? n : undefined
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export interface ListParams {
  page: number
  limit: number
  q: string
  from?: number
  to?: number
}

export function parseListParams(url: URL): ListParams {
  const page = Math.max(1, Math.round(Number(url.searchParams.get('page') ?? 1) || 1))
  const limit = Math.min(100, Math.max(1, Math.round(Number(url.searchParams.get('limit') ?? 20) || 20)))
  const q = (url.searchParams.get('q') ?? '').trim()
  const fromRaw = Number(url.searchParams.get('from'))
  const toRaw = Number(url.searchParams.get('to'))
  return {
    page,
    limit,
    q,
    from: Number.isFinite(fromRaw) && fromRaw > 0 ? fromRaw : undefined,
    to: Number.isFinite(toRaw) && toRaw > 0 ? toRaw : undefined,
  }
}

export function regexEscape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function money(n: number): string {
  return `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return formatDate(ts)
}
