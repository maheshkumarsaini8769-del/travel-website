'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Loader2, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'

interface ImageDoc {
  id: string
  mime: string
  size: number
  name: string
  url: string
}

const fmt = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminImages() {
  const [images, setImages] = useState<ImageDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/images')
      if (res.ok) setImages(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const upload = async (files: FileList | null) => {
    if (!files?.length || uploading) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error('Read failed'))
          reader.readAsDataURL(file)
        })
        const res = await fetch('/api/images', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ data: dataUrl, name: file.name }),
        })
        if (!res.ok) throw new Error(`Upload failed (${res.status})`)
      }
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const remove = async (img: ImageDoc) => {
    if (!confirm(`Delete image "${img.name || img.id}"?`)) return
    const res = await fetch(`/api/images/${img.id}`, { method: 'DELETE' })
    if (res.ok) setImages((list) => list.filter((x) => x.id !== img.id))
    else alert('Delete failed')
  }

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      return
    }
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Image Library</h1>
          <p className="mt-1 text-sm text-slate-400">
            Uploads stored in MongoDB · {images.length} image{images.length === 1 ? '' : 's'}
          </p>
        </div>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
        <button
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading…' : 'Upload images'}
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-center text-sm text-slate-500">Loading images…</p>
      ) : images.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-14 text-center">
          <p className="text-sm text-slate-400">No images yet.</p>
          <p className="mt-1 text-xs text-slate-500">Upload one and copy its URL into a package form.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="aspect-video bg-black/40">
                <Image src={img.url} alt={img.name} width={320} height={180} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium text-slate-300">{img.name}</p>
                <p className="text-[10px] text-slate-500">
                  {img.mime} · {fmt(img.size)}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copy(img.url)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 p-1.5 text-[11px] font-semibold text-slate-300 hover:border-orange-400/40 hover:text-white"
                  >
                    {copied === img.url ? (
                      <span className="inline-flex items-center gap-1 text-orange-300">
                        <Check className="h-3 w-3" /> Copied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy URL
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => remove(img)}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-6 text-center text-xs text-slate-600">Tip: copy the URL of an image and paste it into the Cover / Gallery fields of any package.</p>
    </div>
  )
}