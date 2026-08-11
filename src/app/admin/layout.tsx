'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ImageIcon, LayoutDashboard, LogOut, Package } from 'lucide-react'
import Image from 'next/image'

const OPEN_ROUTES = ['/admin/login']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'authed' | 'guest'>('loading')
  const [checked, setChecked] = useState<string | null>(null)

  useEffect(() => {
    let done = false
    setChecked(null)
    fetch('/api/admin/me')
      .then((r) => {
        if (!done) {
          setState(r.ok ? 'authed' : 'guest')
          setChecked(pathname)
        }
      })
      .catch(() => {
        if (!done) {
          setState('guest')
          setChecked(pathname)
        }
      })
    return () => {
      done = true
    }
  }, [pathname])

  useEffect(() => {
    if (!pathname || checked !== pathname) return
    if (state === 'guest' && !OPEN_ROUTES.includes(pathname)) router.replace('/admin/login')
    if (state === 'authed' && pathname === '/admin/login') router.replace('/admin/packages')
  }, [state, pathname, checked, router])

  if (checked !== pathname || (state === 'guest' && pathname !== null && !OPEN_ROUTES.includes(pathname))) {
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
            <Image
              src="/images/logo.png"
              alt="Sunsky Tourism logo"
              width={1536}
              height={1024}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <span className="text-base font-extrabold tracking-wide">
              SUNSKY <span className="text-orange-400">TOURISM</span>
              <span className="ml-1 rounded-full border border-orange-400/30 bg-orange-500/10 px-2 py-0.5 align-middle text-[9px] font-bold uppercase tracking-widest text-orange-300">
                Admin
              </span>
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
            <ImageIcon className="h-4 w-4" />
            Images
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}