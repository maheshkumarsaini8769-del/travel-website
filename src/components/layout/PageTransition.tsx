'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    setOpacity(0)
    const t = setTimeout(() => setOpacity(1), 50)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <main style={{ opacity, transition: 'opacity 0.2s ease-out' }}>
      {children}
    </main>
  )
}
