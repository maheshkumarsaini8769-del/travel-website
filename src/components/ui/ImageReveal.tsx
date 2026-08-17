'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
      className={`relative overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
        decoding="async"
        className={`object-cover ${imgClassName}`}
      />
    </motion.div>
  )
}
