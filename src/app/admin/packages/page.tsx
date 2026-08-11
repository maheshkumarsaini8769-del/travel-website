'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import type { TravelPackage } from '@/data/packages'

export default function AdminPackages() {
  const router = useRouter()
  const [pkgs, setPkgs] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/packages')
      if (res.ok) setPkgs(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (p: TravelPackage) => {
    if (!confirm(`Delete "${p.name}"?\n\nDeleting removes its stored images too.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/packages/${p.id}`, { method: 'DELETE' })
      if (!res.ok) {
        alert('Delete failed')
      } else {
        setPkgs((list) => list.filter((x) => x.id !== p.id))
      }
    } finally {
      setBusy(false)
    }
  }

  const seed = async () => {
    if (!confirm('Copy all default static packages into the database? Existing packages are kept, defaults are updated.')) return
    setBusy(true)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      if (!res.ok) alert('Seed failed')
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Packages</h1>
          <p className="mt-1 text-sm text-slate-400">
            {pkgs.length} package{pkgs.length === 1 ? '' : 's'} · database first, static defaults as fallback
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={seed}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-orange-400/40 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Seed from defaults
          </button>
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            New Package
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="mt-10 text-center text-sm text-slate-500">Loading packages…</p>
      ) : pkgs.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-14 text-center">
          <p className="text-sm text-slate-400">No packages yet.</p>
          <p className="mt-1 text-xs text-slate-500">
            Click “Seed from defaults” to import the static packages, or create one manually.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Package</th>
                <th className="px-5 py-3.5 font-semibold">Region</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Rating</th>
                <th className="px-5 py-3.5 font-semibold">Featured</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pkgs.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{p.id}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{p.region || '—'}</td>
                  <td className="px-5 py-4 text-slate-300">
                    {p.currency || '₹'}
                    {p.pricePerPerson.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-slate-300">{p.rating || '—'} ★</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        p.featured ? 'bg-orange-500/15 text-orange-300' : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      {p.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/packages/${p.id}`}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        disabled={busy}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-600">Tip: “View Site” opens the public site — edits appear instantly there.</p>
    </div>
  )
}