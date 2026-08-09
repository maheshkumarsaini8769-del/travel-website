'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'

interface FaqAccordionProps {
  items: { question: string; answer: string }[]
  className?: string
}

export default function FaqAccordion({ items, className = '' }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <StaggerGroup className={`space-y-3 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <StaggerItem key={item.question}>
            <div
              className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                isOpen ? 'border-orange-400/30 bg-white/[0.05]' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-semibold text-white sm:text-base">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-orange-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-slate-400">{item.answer}</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        )
      })}
    </StaggerGroup>
  )
}
