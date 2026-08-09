'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Menu, X, MessageCircle } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'

const navItems = [
  { name: 'Destinations', href: '/destinations' },
  { name: 'Tours', href: '/tours' },
  { name: 'Packages', href: '/packages' },
  { name: 'Guides', href: '/travel-guides' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const mobileItems = [
  ...navItems,
  { name: 'Services', href: '/services' },
  { name: 'Plan My Trip', href: '/plan-your-trip' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => {
    const path = pathname ?? '/'
    return href === '/' ? path === '/' : path.startsWith(href)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-black/55 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 sm:h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Sunsky Tourism home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_20px_rgba(249,115,22,0.45)] transition-transform duration-300 group-hover:rotate-12">
              <Sun className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-extrabold tracking-wide text-white sm:text-xl">
              SUNSKY<span className="text-orange-400"> TOURISM</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive(item.href) ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full border border-orange-500/40 bg-orange-500/15"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <Link
              href="/plan-your-trip"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(249,115,22,0.45)] lg:inline-flex"
            >
              <MessageCircle className="h-4 w-4" />
              Plan My Trip
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col items-center justify-center gap-2 px-8"
            >
              <div className="mb-4 w-full max-w-xs">
                <SearchBar />
              </div>
              {mobileItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    className={`block px-6 py-2.5 text-2xl font-bold tracking-tight transition-colors ${
                      isActive(item.href) ? 'text-orange-400' : 'text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="mt-6"
              >
                <Link
                  href="/plan-your-trip"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 font-semibold text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  Plan My Trip
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
