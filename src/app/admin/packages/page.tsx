'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { Badge, ConfirmDialog, PageHeader, useToast, Button } from '@/components/admin/ui'
import type { TravelPackage } from '@/data/packages'

export default function AdminPackages() {
  const router = useRouter()
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState<TravelPackage | null>(null)
  const [busy, setBusy] = useState(false)

  const seed = async () => {
    if (!confirm('Copy all default static packages + destinations + settings into the database?')) return
    setBusy(true)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      if (!res.ok) throw new Error()
      toast('success', 'Database seeded from defaults')
    } catch {
      toast('error', 'Seed failed — database not connected?')
    } finally {
      setBusy(false)
    }
  }

  const duplicate = async (p: TravelPackage) => {
    const newId = prompt(`Copy "${p.name}" as new package?\nEnter new id:`, `${p.id}-copy`)
    if (!newId) return
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, id: newId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'), name: `${p.name} (Copy)` }),
      })
      if (!res.ok) throw new Error()
      toast('success', 'Package duplicated')
      router.push(`/admin/packages/${newId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')}`)
    } catch {
      toast('error', 'Duplicate failed — id may already exist')
    }
  }

  return (
    <div>
      <PageHeader
        title="Packages"
        subtitle="Database-first with static defaults as fallback"
        actions={
          <>
            <Button variant="ghost" onClick={seed} disabled={busy}>
              <RefreshCw className="h-3.5 w-3.5" />
              Seed from defaults
            </Button>
            <Link href="/admin/packages/new">
              <Button>
                <Plus className="h-4 w-4" />
                New Package
              </Button>
            </Link>
          </>
        }
      />

      <DataTable<TravelPackage>
        columns={[
          {
            key: 'name',
            label: 'Package',
            render: (p) => (
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{p.id}</p>
              </div>
            ),
          },
          { key: 'region', label: 'Region', render: (p) => <span className="text-slate-400">{p.region || '—'}</span> },
          {
            key: 'price',
            label: 'Price',
            render: (p) => (
              <span className="font-semibold text-slate-200">
                {p.currency || '₹'}
                {p.pricePerPerson.toLocaleString('en-IN')}
              </span>
            ),
          },
          { key: 'duration', label: 'Duration', render: (p) => <span className="text-slate-400">{p.duration || '—'}</span> },
          {
            key: 'featured',
            label: 'Status',
            render: (p) => (
              <div className="flex flex-wrap gap-1">
                {p.featured && <Badge color="orange">Featured</Badge>}
                <Badge color="green">Published</Badge>
              </div>
            ),
          },
        ]}
        fetchUrl={(page, q) => `/api/packages?q=${encodeURIComponent(q)}&page=${page}`}
        searchPlaceholder="Search packages…"
        emptyTitle="No packages yet"
        emptyHint="Click Seed from defaults to import the static packages, or create one manually."
        actions={(p) => (
          <>
            <button onClick={() => duplicate(p)} title="Duplicate" className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-orange-300">
              <Copy className="h-3.5 w-3.5" />
            </button>
            <Link href={`/admin/packages/${p.id}`} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white" title="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            <button onClick={() => setToDelete(p)} title="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          const res = await fetch(`/api/packages/${toDelete.id}`, { method: 'DELETE' })
          if (res.ok) toast('success', 'Package deleted')
          else toast('error', 'Delete failed')
        }}
        title="Delete package?"
        message={`"${toDelete?.name}" will be permanently deleted — its stored images too.`}
      />

      <p className="mt-6 text-center text-xs text-slate-600">Tip: “View Site” opens the public site — edits appear instantly there.</p>
    </div>
  )
}
