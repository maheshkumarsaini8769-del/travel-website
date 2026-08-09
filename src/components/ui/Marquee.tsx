'use client'

import { useMemo } from 'react'

interface MarqueeProps {
  items: string[]
  reverse?: boolean
  speed?: number
  className?: string
}

export default function Marquee({ items, reverse = false, speed = 32, className = '' }: MarqueeProps) {
  const loop = useMemo(() => [...items, ...items, ...items], [items])

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="marquee-anim flex w-max items-center"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 pr-6 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 sm:text-base"
          >
            {item}
            <span className="text-orange-500/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
