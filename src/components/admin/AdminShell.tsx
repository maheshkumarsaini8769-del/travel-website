'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

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

    fetch('/api/admin/me', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => {
        if (!active) return
        if (r.ok) {
          setOk(true)
          setChecking(false)
        } else {
          setOk(false)
          setChecking(false)
          router.replace('/admin/login')
        }
      })
      .catch(() => {
        if (!active) return
        setOk(false)
        setChecking(false)
        router.replace('/admin/login')
      })

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
