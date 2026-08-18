'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/ui/TextReveal'

interface GalleryProps {
  images: string[]
  alt: string
}

export default function Gallery({ images, alt }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null)

  const close = () => setIndex(null)
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % images.length))
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {images.map((src, i) => (
          <Reveal key={src + i} delay={i * 0.06}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className={`group relative block w-full overflow-hidden rounded-2xl border border-white/10 ${
                i === 0 ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2' : ''
              }`}
              aria-label={`View ${alt} photo ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy" decoding="async"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" aria-hidden="true" />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {index !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15"
              aria-label="Close photo viewer"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 sm:left-6"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[index]}
                alt={`${alt} photo ${index + 1}`}
                width={1600}
                height={1200}
                sizes="(max-width: 768px) 92vw, 1600px"
                className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain"
              />
            </motion.div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 sm:right-6"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white">
              {index + 1} / {images.length}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
