'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, CornerDownLeft, Compass, Clock3, Briefcase, BookOpen } from 'lucide-react'
import { searchItems, type SearchItem } from '@/lib/search'
import { packages } from '@/data/packages'
import type { TravelPackage } from '@/data/packages'

const SEARCH_MARKER = 'search-overlay'

const typeIcon: Record<SearchItem['type'], typeof Compass> = {
  Destination: Compass,
  Tour: Clock3,
  Package: Briefcase,
  Guide: BookOpen,
}

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [highlight, setHighlight] = useState(0)
  const [pkgs, setPkgs] = useState<TravelPackage[]>(packages)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    let done = false
    fetch('/api/packages')
      .then((r) => r.json())
      .then((data: TravelPackage[]) => {
        if (!done && Array.isArray(data) && data.length) setPkgs(data)
      })
      .catch(() => {})
    return () => {
      done = true
    }
  }, [])

  const results = searchItems(q, pkgs)

  useEffect(() => {
    if (open) {
      setQ('')
      setHighlight(0)
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    window.history.pushState({ type: SEARCH_MARKER }, '')
    const onPop = () => setOpen(false)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [open])

  const closeSearch = useCallback(() => {
    if (window.history.state?.type === SEARCH_MARKER) {
      window.history.back()
    }
    setOpen(false)
  }, [])

  const navigate = useCallback(
    (href: string) => {
      if (window.history.state?.type === SEARCH_MARKER) {
        let done = false
        const nav = () => {
          if (done) return
          done = true
          router.push(href)
        }
        window.addEventListener('popstate', nav, { once: true })
        window.history.back()
        window.setTimeout(nav, 500)
      } else {
        router.push(href)
      }
      setOpen(false)
    },
    [router]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSearch])

  const go = (href: string) => {
    navigate(href)
  }

  const submit = () => {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) {
      if (e.key === 'Enter') submit()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlight >= 0 && results[highlight]) go(results[highlight].href)
      else submit()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search destinations, tours and packages"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-colors duration-300 hover:border-orange-400/40 hover:text-orange-300"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-xl"
            onClick={closeSearch}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto mt-20 w-[min(92vw,620px)] overflow-hidden rounded-[24px] border border-white/10 bg-[#0c0c0f] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <Search className="h-5 w-5 shrink-0 text-orange-400" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search Jaipur, desert safari, Goa, Dubai…"
                  className="w-full bg-transparent text-base text-white placeholder:text-slate-600 focus:outline-none"
                />
                <button
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2">
                {q.trim() === '' ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-500">
                    Try &ldquo;Jaipur&rdquo;, &ldquo;desert safari&rdquo;, &ldquo;family package&rdquo; or &ldquo;best time to visit&rdquo;
                  </p>
                ) : results.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-500">
                    No matches for &ldquo;{q}&rdquo; — press Enter to send it to our team.
                  </p>
                ) : (
                  <ul>
                    {results.map((item, i) => {
                      const Icon = typeIcon[item.type]
                      return (
                        <li key={`${item.type}-${item.title}`}>
                          <button
                            type="button"
                            onClick={() => go(item.href)}
                            onMouseEnter={() => setHighlight(i)}
                            className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors duration-200 ${
                              highlight === i ? 'bg-orange-500/10' : ''
                            }`}
                          >
                            <Image
                              src={item.image}
                              alt=""
                              width={96}
                              height={96}
                              sizes="48px"
                              loading="lazy" decoding="async"
                              className="h-12 w-12 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                              <p className="truncate text-xs text-slate-500">{item.subtitle}</p>
                            </div>
                            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                              <Icon className="h-3 w-3" />
                              {item.type}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-slate-500">
                <span>
                  <kbd className="mr-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↑↓</kbd>
                  to navigate
                </span>
                <span>
                  <kbd className="mr-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5">Enter</kbd>
                  to open
                </span>
                <span className="hidden sm:inline">
                  All results on the <span className="font-semibold text-slate-400">/search</span> page
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
