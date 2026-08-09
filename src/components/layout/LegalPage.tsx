import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { contact } from '@/data/contact'

interface LegalSection {
  heading: string
  text: string
}

interface LegalPageProps {
  title: string
  updated: string
  sections: LegalSection[]
  note: string
}

export default function LegalPage({ title, updated, sections, note }: LegalPageProps) {
  return (
    <section className="relative pb-24 pt-32 sm:pb-32 sm:pt-36">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          <Link href="/" className="transition-colors hover:text-orange-300">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-slate-300">{title}</span>
        </nav>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm font-medium text-orange-300">Last updated: {updated}</p>

        <div className="mt-10 space-y-9">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-lg font-bold text-white">{s.heading}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-6 sm:p-7">
          <p className="text-sm font-semibold text-amber-200">Note</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{note}</p>
          <p className="mt-4 text-sm text-slate-400">
            Questions? Contact us at{' '}
            <a href={`mailto:${contact.email}`} className="font-semibold text-orange-300 hover:underline">
              {contact.email}
            </a>{' '}
            or call {contact.phones[0]} / {contact.phones[1]}.
          </p>
        </div>
      </div>
    </section>
  )
}
