'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('zenux_oauth_tokens') || sessionStorage.getItem('zenux_oauth_tokens')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed?.access_token || parsed?.tokens?.access_token || parsed?.id_token || null
    }
  } catch {}
  return null
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [ok, setOk] = useState(isLoginPage)
  const [checking, setChecking] = useState(!isLoginPage)

  useEffect(() => {
    if (isLoginPage) {
      setOk(true)
      setChecking(false)
      return
    }

    let active = true
    setChecking(true)

    async function checkAuth() {
      try {
        const token = getStoredToken()
        const headers: Record<string, string> = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const r = await fetch('/api/admin/me', {
          credentials: 'same-origin',
          cache: 'no-store',
          headers,
        })

        if (!active) return

        if (r.ok) {
          setOk(true)
          setChecking(false)
          return
        }

        // If 401 but we have an OAuth token, attempt one-time session sync
        if (token && r.status === 401) {
          try {
            const syncRes = await fetch('/api/auth/login', {
              method: 'POST',
              credentials: 'same-origin',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ accessToken: token, oauth: true }),
            })
            if (syncRes.ok) {
              const retryRes = await fetch('/api/admin/me', {
                credentials: 'same-origin',
                cache: 'no-store',
                headers,
              })
              if (retryRes.ok && active) {
                setOk(true)
                setChecking(false)
                return
              }
            }
          } catch {}
        }

        if (active) {
          setOk(false)
          setChecking(false)
          router.replace('/admin/login')
        }
      } catch {
        if (active) {
          setOk(false)
          setChecking(false)
          router.replace('/admin/login')
        }
      }
    }

    checkAuth()

    return () => {
      active = false
    }
  }, [isLoginPage, pathname, router])

  if (isLoginPage) return <>{children}</>

  if (checking || !ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070707]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Opening Admin Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#070707]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 pt-16 lg:pt-6 lg:pl-72">
        {children}
      </main>
    </div>
  )
}
