'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import BackToTop from '@/components/ui/BackToTop'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') ?? false

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <FloatingButtons />
      <BackToTop />
    </>
  )
}