'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setOk(true)
      return
    }
    fetch('/api/reviews?all=1')
      .then((r) => {
        if (r.ok) {
          setOk(true)
        } else {
          router.replace('/admin/login')
        }
      })
      .catch(() => {
        setOk(true)
      })
  }, [pathname, router])

  if (!ok) return null

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="flex min-h-screen bg-[#070707]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 pt-16 lg:pt-6 lg:pl-72">
        {children}
      </main>
    </div>
  )
}