'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    setVisible(false)
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <motion.main
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: ready ? 0.28 : 0, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}
