'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Spinner, EmptyState, ErrorState, Pagination, SearchBox } from './ui'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
  className?: string
}

export function useListData<T>(url: (page: number, q: string, extra: string) => string, extra = '', limit = 20) {
  const [items, setItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [extraState, setExtraState] = useState(extra)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const seq = useRef(0)

  const debouncedQ = useDebounce(q, 350)

  const reload = useCallback(async () => {
    const mySeq = ++seq.current
    setLoading(true)
    setError('')
    try {
      const res = await fetch(url(page, debouncedQ, extraState))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = (await res.json()) as T[] | { items?: T[]; total?: number }
      if (seq.current === mySeq) {
        if (Array.isArray(raw)) {
          setItems(raw)
          setTotal(raw.length)
        } else {
          setItems(raw.items ?? [])
          setTotal(raw.total ?? 0)
        }
      }
    } catch {
      if (seq.current === mySeq) setError('Could not load data. Please try again.')
    } finally {
      if (seq.current === mySeq) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, page, debouncedQ, extraState])

  useEffect(() => {
    void reload()
  }, [reload])

  return { items, total, page, setPage, q, setQ, setExtraState, reload, loading, error, limit }
}

export function useDebounce<T>(value: T, delay: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

export function DataTable<T extends { id?: string; _id?: string }>({
  columns,
  fetchUrl,
  searchPlaceholder,
  extra,
  actions,
  emptyTitle,
  emptyHint,
  defaultLimit = 20,
  refreshKey,
}: {
  columns: Column<T>[]
  fetchUrl: (page: number, q: string, extra: string) => string
  searchPlaceholder?: string
  extra?: string
  actions?: (item: T) => ReactNode
  emptyTitle?: string
  emptyHint?: string
  defaultLimit?: number
  refreshKey?: number
}) {
  const { items, total, page, setPage, q, setQ, reload, loading, error, limit } = useListData<T>(fetchUrl, extra ?? '', defaultLimit)

  useEffect(() => {
    if (refreshKey) void reload()
  }, [refreshKey, reload])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-xs">
          <SearchBox value={q} onChange={setQ} placeholder={searchPlaceholder ?? 'Search…'} />
        </div>
        <button onClick={() => void reload()} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-orange-400/40">
          Refresh
        </button>
      </div>

      {loading ? (
        <Spinner label="Loading…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : items.length === 0 ? (
        <EmptyState title={emptyTitle ?? 'No records found'} hint={emptyHint ?? 'Try changing your search or filters.'} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-[11px] uppercase tracking-wider text-slate-400">
                {columns.map((c) => (
                  <th key={c.key} className={`px-4 py-3 font-semibold ${c.className ?? ''}`}>
                    {c.label}
                  </th>
                ))}
                {actions && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={String((item as { id?: string }).id ?? (item as { _id?: string })._id ?? JSON.stringify(item))} className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.02]">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 text-slate-300 ${c.className ?? ''}`}>
                      {c.render ? c.render(item) : String((item as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">{actions(item)}</div>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} total={total} limit={limit} onPage={setPage} />
    </div>
  )
}