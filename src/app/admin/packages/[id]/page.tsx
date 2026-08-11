'use client'

import { useEffect, useState } from 'react'
import PackageForm from '@/components/admin/PackageForm'
import type { TravelPackage } from '@/data/packages'

export default function EditPackagePage({ params }: { params: { id: string } }) {
  const [pkg, setPkg] = useState<TravelPackage | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    let done = false
    fetch(`/api/packages/${params.id}`)
      .then(async (res) => {
        if (done) return
        if (res.ok) {
          setPkg(await res.json())
          setState('ready')
        } else {
          setState('missing')
        }
      })
      .catch(() => {
        if (!done) setState('missing')
      })
    return () => {
      done = true
    }
  }, [params.id])

  if (state === 'loading') return <p className="py-14 text-center text-sm text-slate-500">Loading package…</p>

  if (state === 'missing') {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-14 text-center">
        <p className="text-sm font-semibold text-white">Package “{params.id}” not found</p>
        <p className="mt-1 text-xs text-slate-500">It may have been deleted, or never existed.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Edit Package</h1>
      <p className="mt-1 text-sm text-slate-400">
        <span className="text-orange-400">{pkg?.id}</span> · updates are saved to MongoDB instantly
      </p>
      <div className="mt-6">
        <PackageForm initial={pkg} editableId />
      </div>
    </div>
  )
}