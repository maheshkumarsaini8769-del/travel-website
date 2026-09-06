'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import BackToTop from '@/components/ui/BackToTop'

const Navbar = dynamic(() => import('./Navbar'), { ssr: false })

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