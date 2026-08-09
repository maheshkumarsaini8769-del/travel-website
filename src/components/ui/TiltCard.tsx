'use client'

import { useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion, isTouchDevice } from '@/lib/helpers'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
}

export default function TiltCard({ children, className = '', maxTilt = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const onMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || isTouchDevice() || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(1000px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(
        px * maxTilt
      ).toFixed(2)}deg) translateY(-4px)`,
      transition: 'transform 0.08s linear',
    })
  }

  const onMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
      transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </div>
  )
}
