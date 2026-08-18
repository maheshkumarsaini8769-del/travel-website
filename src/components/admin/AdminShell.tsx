'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Bell, CalendarCheck, Camera, Car, ChevronDown, Copy, ExternalLink, Hotel, LayoutDashboard,
  LineChart, LogOut, MapPin, Menu, Package, Receipt, Settings, ShieldCheck, ShoppingBag,
  Star, Ticket, Users, X, Building2, Globe, FileText, Boxes,
} from 'lucide-react'
import { ROLE_LABELS } from '@/lib/roles'

const OPEN_ROUTES = ['/admin/login']

interface UserInfo {
  username: string
  name: string
  role: string
  permissions: string[]
}

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
  perm: string
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard.view' }],
  },
  {
    section: 'Catalog',
    items: [
      { href: '/admin/packages', label: 'Packages', icon: Package, perm: 'packages.view' },
      { href: '/admin/destinations', label: 'Destinations', icon: MapPin, perm: 'destinations.view' },
      { href: '/admin/images', label: 'Image Library', icon: Camera, perm: 'images.view' },
      { href: '/admin/hotels', label: 'Hotels', icon: Hotel, perm: 'hotels.view' },
      { href: '/admin/vehicles', label: 'Vehicles', icon: Car, perm: 'vehicles.view' },
      { href: '/admin/limits', label: 'Stock & Limits', icon: Boxes, perm: 'packages.view' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck, perm: 'bookings.view' },
      { href: '/admin/leads', label: 'Enquiries', icon: FileText, perm: 'leads.view' },
      { href: '/admin/customers', label: 'Customers', icon: Users, perm: 'customers.view' },
      { href: '/admin/payments', label: 'Payments', icon: Receipt, perm: 'payments.view' },
    ],
  },
  {
    section: 'Growth',
    items: [
      { href: '/admin/coupons', label: 'Coupons & Offers', icon: Ticket, perm: 'coupons.view' },
      { href: '/admin/reviews', label: 'Reviews', icon: Star, perm: 'reviews.view' },
    ],
  },
  {
    section: 'Content & Insight',
    items: [
      { href: '/admin/cms', label: 'Website CMS', icon: Globe, perm: 'cms.view' },
      { href: '/admin/reports', label: 'Reports & Export', icon: LineChart, perm: 'reports.view' },
    ],
  },
  {
    section: 'System',
    items: [
      { href: '/admin/users', label: 'Users & Roles', icon: ShieldCheck, perm: 'admin.users.view' },
      { href: '/admin/audit', label: 'Audit Log', icon: Copy, perm: 'audit.view' },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell, perm: 'notifications.view' },
      { href: '/admin/settings', label: 'Settings', icon: Settings, perm: 'settings.view' },
    ],
  },
]

const ROLE_DEFAULTS: Record<string, string[]> = {
  superadmin: ['*'],
  manager: ['dashboard.view', 'bookings.*', 'customers.*', 'packages.*', 'leads.*', 'payments.*', 'reports.*'],
  'booking-staff': ['dashboard.view', 'bookings.view', 'bookings.edit', 'customers.view', 'customers.edit', 'leads.view', 'leads.edit'],
  'content-manager': ['dashboard.view', 'packages.*', 'destinations.*', 'cms.*', 'reviews.*', 'images.*'],
}

export function can(user: UserInfo | null, perm: string): boolean {
  if (!user) return false
  const custom = user.permissions ?? []
  if (custom.includes('*')) return true
  if (custom.includes(perm)) return true
  const mod = perm.split('.')[0]
  if (custom.includes(`${mod}.*`)) return true
  const defaults = ROLE_DEFAULTS[user.role] ?? []
  if (defaults.includes('*')) return true
  if (defaults.includes(perm)) return true
  return defaults.includes(`${mod}.*`)
}

let cachedUser: UserInfo | null = null
let cachedState: 'authed' | 'guest' | null = null

function useAuthGuard() {
  const pathname = usePathname()
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'authed' | 'guest'>(cachedState ?? 'loading')
  const [checked, setChecked] = useState<string | null>(null)
  const [user, setUser] = useState<UserInfo | null>(cachedUser)

  useEffect(() => {
    let done = false
    fetch('/api/admin/me')
      .then(async (r) => {
        if (done) return
        if (r.ok) {
          const data = (await r.json()) as { user: UserInfo }
          cachedUser = data.user
          cachedState = 'authed'
          setUser(data.user)
          setState('authed')
        } else {
          cachedUser = null
          cachedState = 'guest'
          setUser(null)
          setState('guest')
        }
        setChecked(pathname)
      })
      .catch(() => {
        if (done) return
        if (cachedState) {
          setChecked(pathname)
          return
        }
        cachedUser = null
        cachedState = 'guest'
        setUser(null)
        setState('guest')
        setChecked(pathname)
      })
    return () => {
      done = true
    }
  }, [pathname])

  useEffect(() => {
    if (!pathname) return
    if (state === 'guest' && !OPEN_ROUTES.includes(pathname)) router.replace('/admin/login')
    if (state === 'authed' && pathname === '/admin/login') router.replace('/admin')
  }, [state, pathname, router])

  const loadingView =
    (cachedState === null && checked !== pathname) ||
    (state === 'guest' && pathname !== null && !OPEN_ROUTES.includes(pathname))
  return { state, checked, user, pathname, loadingView }
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { state, checked, user, pathname, loadingView } = useAuthGuard()
  const [drawer, setDrawer] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [notifs, setNotifs] = useState<{ id: string; title: string; message: string; createdAt: number; read: boolean }[]>([])
  const [unread, setUnread] = useState(0)
  const bellRef = useRef<HTMLDivElement>(null)

  const loadNotifs = useCallback(() => {
    fetch('/api/notifications?limit=8')
      .then((r) => r.json())
      .then((d: { items?: { id: string; title: string; message: string; createdAt: number; read: boolean }[]; unread?: number }) => {
        setNotifs(d.items ?? [])
        setUnread(d.unread ?? 0)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (state !== 'authed') return
    loadNotifs()
    const t = setInterval(loadNotifs, 45_000)
    return () => clearInterval(t)
  }, [state, loadNotifs])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (loadingView) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070707]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
      </div>
    )
  }

  const isLogin = (pathname ?? '').startsWith('/admin/login')
  const current = NAV.flatMap((s) => s.items).find((i) => (pathname ?? '').startsWith(i.href))
  const title = isLogin ? 'Sign in' : current?.label ?? 'Dashboard'

  const sidebar = (
    <nav className="flex h-full flex-col overflow-y-auto px-3 py-4">
      <Link href="/admin" className="mb-5 flex items-center gap-2.5 px-2">
        <Image src="/images/logo.webp" alt="Sunsky Tourism logo" width={1536} height={1024} className="h-9 w-9 shrink-0 rounded-full object-cover" />
        <div className="leading-tight">
          <p className="text-sm font-extrabold tracking-wide text-white">
            SUNSKY <span className="text-orange-400">TOURISM</span>
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Admin Panel</p>
        </div>
      </Link>

      {NAV.map((section) => {
        const items = section.items.filter((i) => can(user, i.perm))
        if (items.length === 0) return null
        return (
          <div key={section.section} className="mb-4">
            <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">{section.section}</p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = (pathname ?? '').startsWith(item.href) && item.href !== '/admin' ? true : pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawer(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                      active ? 'bg-orange-500/15 text-orange-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-orange-400' : ''}`} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#070707] text-slate-100">
      {!isLogin && (
        <>
          {/* Desktop sidebar */}
          <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-white/10 bg-[#0a0a0c] lg:block">{sidebar}</aside>

          {/* Mobile drawer */}
          {drawer && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawer(false)} />
              <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-[#0a0a0c] shadow-2xl">
                <button onClick={() => setDrawer(false)} className="absolute right-3 top-3 z-10 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
                {sidebar}
              </aside>
            </div>
          )}
        </>
      )}

      {/* Topbar */}
      {!isLogin && (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0c]/90 backdrop-blur-xl lg:pl-60">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawer(true)} className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden">
                <Menu className="h-4 w-4" />
              </button>
              <h1 className="text-sm font-bold text-white sm:text-base">{title}</h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => {
                    setBellOpen((o) => !o)
                    if (!bellOpen && unread > 0) {
                      void fetch('/api/notifications', { method: 'PUT', body: JSON.stringify({}) })
                      setUnread(0)
                    }
                  }}
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-orange-400/40"
                >
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d11] shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</p>
                      <Link href="/admin/notifications" onClick={() => setBellOpen(false)} className="text-[11px] font-semibold text-orange-400 hover:underline">
                        View all
                      </Link>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <p className="px-4 py-8 text-center text-xs text-slate-600">No notifications yet</p>
                      ) : (
                        notifs.map((n) => (
                          <div key={n.id} className={`border-b border-white/5 px-4 py-3 ${n.read ? '' : 'bg-orange-500/[0.06]'}`}>
                            <p className="text-xs font-bold text-slate-200">{n.title}</p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-orange-400/40 sm:inline-flex">
                <ExternalLink className="h-3 w-3" />
                View Site
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-[11px] font-extrabold text-white">
                  {(user?.name ?? 'A').charAt(0).toUpperCase()}
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-[11px] font-bold text-slate-200">{user?.name ?? 'Admin'}</p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">{user ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? user.role : ''}</p>
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    window.location.href = '/admin/login'
                  }}
                  title="Logout"
                  className="ml-1 text-slate-400 transition-colors hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={`${isLogin ? '' : 'px-4 py-6 sm:px-6 lg:pl-64 lg:pr-8'}`}>{children}</main>
    </div>
  )
}
