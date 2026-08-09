'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import MagneticButton from './MagneticButton'

interface PremiumButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  magnetic?: boolean
  className?: string
  external?: boolean
  ariaLabel?: string
}

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-sm sm:text-base',
  lg: 'px-9 py-4 text-base sm:text-lg',
}

const variants = {
  primary:
    'btn-shine text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_8px_25px_rgba(249,115,22,0.25)] hover:shadow-[0_12px_35px_rgba(249,115,22,0.4)] border border-orange-400/40',
  secondary:
    'text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-orange-400/50 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]',
  ghost: 'text-orange-400 border border-orange-500/30 hover:bg-orange-500/10',
}

export default function PremiumButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  magnetic = false,
  className = '',
  external = false,
  ariaLabel,
}: PremiumButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707] ${sizes[size]} ${variants[variant]} ${className}`

  const inner = href ? (
    external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  ) : (
    <button onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  )

  if (magnetic) {
    return <MagneticButton className="inline-block">{inner}</MagneticButton>
  }
  return inner
}
