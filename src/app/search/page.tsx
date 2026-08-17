import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { searchItems, groupByType, typeLabel, type SearchItem } from '@/lib/search'
import { getPackages } from '@/lib/data'
import { whatsappDefault } from '@/lib/helpers'
import { Search, ArrowUpRight, MessageCircle, Compass, Clock3, Briefcase, BookOpen } from 'lucide-react'

interface Props {
  searchParams: { q?: string }
}

export const metadata: Metadata = {
  title: 'Search | Sunsky Tourism',
  description: 'Search destinations, tours, holiday packages and travel guides on Sunsky Tourism.',
  alternates: { canonical: '/search' },
}

const typeIcon: Record<SearchItem['type'], typeof Compass> = {
  Destination: Compass,
  Tour: Clock3,
  Package: Briefcase,
  Guide: BookOpen,
}

async function SearchResults({ query }: { query: string }) {
  const pkgs = await getPackages()
  const items = searchItems(query, pkgs)
  const groups = groupByType(items)

  if (query.trim() === '') {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-10 text-center sm:p-14">
        <Search className="mx-auto h-10 w-10 text-slate-600" />
        <h2 className="mt-4 text-xl font-bold text-white">Search our site</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
          Type above to find destinations, tours, packages and guides — for example &ldquo;Jaipur&rdquo;,
          &ldquo;desert safari&rdquo; or &ldquo;kashmir&rdquo;.
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-10 text-center sm:p-14">
        <h2 className="text-xl font-bold text-white">No results for &ldquo;{query}&rdquo;</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
          Try a different word, or message us directly — we plan trips to hundreds of places not yet
          listed on the site.
        </p>
        <a
          href={whatsappDefault}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
        >
          <MessageCircle className="h-4 w-4" />
          Ask on WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group[0].type}>
          <div className="mb-5 flex items-center gap-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-400/25 bg-orange-500/10">
                {(() => {
                  const Icon = typeIcon[group[0].type]
                  return <Icon className="h-4 w-4 text-orange-400" />
                })()}
              </span>
              {typeLabel[group[0].type]}
              <span className="text-sm font-semibold text-slate-500">({group.length})</span>
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {group.map((item) => (
              <Link
                key={`${item.type}-${item.title}`}
                href={item.href}
                className="group flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-orange-400/30"
              >
                <Image
                  src={item.image}
                  alt=""
                  width={128}
                  height={128}
                  loading="lazy" decoding="async"
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{item.subtitle}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange-400" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function SearchPage({ searchParams }: Props) {
  const q = searchParams.q ?? ''

  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
            <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-orange-400/70" aria-hidden="true" />
            Search
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            {q.trim() ? <>Results for &ldquo;{q}&rdquo;</> : <>What are you looking for?</>}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            {q.trim()
              ? `${searchItems(q).length} matches across destinations, tours, packages and guides.`
              : 'Use the search box in the menu to find destinations, tours, packages and guides instantly.'}
          </p>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<p className="text-sm text-slate-500">Searching…</p>}>
            <SearchResults query={q} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
