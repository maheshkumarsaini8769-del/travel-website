'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import PremiumButton from '@/components/ui/PremiumButton'
import { ctaImages } from '@/data/images'
import { whatsappDefault } from '@/lib/helpers'

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <div className="absolute inset-0">
        <Image loading="lazy" decoding="async" src={ctaImages.cinematic} alt="Sunsky Tourism travel experience — premium holiday packages" fill sizes="100vw" className="object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.18),transparent_60%)]" aria-hidden="true" />
      </div>
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Let&apos;s begin
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl"
        >
          Your Next Journey <span className="gradient-text">Starts Here.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          Let&apos;s turn your travel plans into an unforgettable experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton>
            <PremiumButton href="/packages" size="lg">
              Explore Packages
              <ArrowRight className="h-4 w-4" />
            </PremiumButton>
          </MagneticButton>
          <MagneticButton>
            <PremiumButton href={whatsappDefault} external size="lg" variant="secondary">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              WhatsApp Us
            </PremiumButton>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
