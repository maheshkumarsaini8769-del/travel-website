'use client'

import { motion } from 'framer-motion'
import { maskReveal, viewportOnce } from '@/lib/motion'

interface ImageRevealProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

export default function ImageReveal({ src, alt, className = '', imgClassName = '' }: ImageRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={maskReveal}
      className={`overflow-hidden ${className}`}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className={`w-full h-full object-cover ${imgClassName}`} />
    </motion.div>
  )
}
