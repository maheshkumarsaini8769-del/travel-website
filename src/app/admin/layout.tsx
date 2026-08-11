'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, LogOut, Package, Sun } from 'lucide-react'
import Image from 'next/image'

const OPEN_ROUTES = ['/admin/login']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'authed' | 'guest'>('loading')

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => setState(r.ok ? 'authed' : 'guest'))
      .catch(() => setState('guest'))
  }, [])

  useEffect(() => {
    if (!pathname) return
    if (state === 'guest' && !OPEN_ROUTES.includes(pathname)) router.replace('/admin/login')
    if (state === 'authed' && pathname === '/admin/login') router.replace('/admin/packages')
  }, [state, pathname, router])

  if (state === 'loading' || (state === 'guest' && pathname !== null && !OPEN_ROUTES.includes(pathname))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070707]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0c]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin/packages" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600">
              <Sun className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-extrabold tracking-wide">
              SUNSKY <span className="text-orange-400">ADMIN</span>
            </span>
            <span className="ml-2 hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:inline">
              Panel
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-orange-400/40 hover:text-white"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              View Site
            </Link>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                router.replace('/admin/login')
              }}
              className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-white/10 bg-[#0b0b0c]/60">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          <Link
            href="/admin/packages"
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              (pathname ?? '').startsWith('/admin/packages')
                ? 'border-orange-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="h-4 w-4" />
            Packages
          </Link>
          <Link
            href="/admin/images"
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              (pathname ?? '').startsWith('/admin/images')
                ? 'border-orange-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Image src="/images/logo.png" alt="" width={16} height={12} className="h-3.5 w-4 object-cover" />
            Images
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}