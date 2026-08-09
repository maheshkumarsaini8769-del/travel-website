'use client'

import TextReveal from './TextReveal'
import { Reveal } from './TextReveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-3xl ${alignCls} mb-14 sm:mb-20 ${className}`}>
      <Reveal>
        <span className="inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">
          <span className="h-px w-8 bg-orange-500/60" aria-hidden="true" />
          {eyebrow}
          <span className="h-px w-8 bg-orange-500/60" aria-hidden="true" />
        </span>
      </Reveal>
      <TextReveal
        as="h2"
        text={title}
        className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white"
      />
      {description ? (
        <Reveal delay={0.15}>
          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">{description}</p>
        </Reveal>
      ) : null}
    </div>
  )
}
