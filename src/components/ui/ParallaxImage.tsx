'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
  rounded?: string
}

export default function ParallaxImage({ src, alt, className = '', speed = 12, rounded = '' }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])

  return (
    <div ref={ref} className={`relative overflow-hidden ${rounded} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy" decoding="async"
        style={{ y, scale: 1.12 }}
        className="w-full h-full object-cover will-change-transform"
      />
    </div>
  )
}
