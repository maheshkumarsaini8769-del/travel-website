'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react'
import TypewriterText from '@/components/ui/TypewriterText'
import TextReveal from '@/components/ui/TextReveal'
import MagneticButton from '@/components/ui/MagneticButton'
import PremiumButton from '@/components/ui/PremiumButton'
import { heroImages } from '@/data/images'
import { whatsappDefault } from '@/lib/helpers'

const TravelScene = dynamic(() => import('@/components/3d/TravelScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
    </div>
  ),
})

const floatingCards = [
  { title: 'Rajasthan', sub: 'Heritage Escape', className: 'left-[4%] top-[18%] hidden xl:flex', delay: 1.4 },
  { title: 'Kashmir', sub: 'Mountain Escape', className: 'right-[2%] top-[30%] hidden xl:flex', delay: 1.6 },
  { title: 'Dubai', sub: 'Luxury Experience', className: 'left-[6%] bottom-[24%] hidden xl:flex', delay: 1.8 },
  { title: 'Goa', sub: 'Beach Holiday', className: 'right-[6%] bottom-[16%] hidden xl:flex', delay: 2.0 },
]

function isLowEndDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = navigator.hardwareConcurrency ?? 8
  const mem = nav.deviceMemory ?? 8
  const oldMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent) && /(android|iphone)/i.test(navigator.userAgent) && (cores <= 4 || mem <= 4)
  return cores <= 4 && mem <= 4 ? true : oldMobile
}

export default function Hero() {
  const [mode, setMode] = useState<'checking' | 'globe' | 'static'>('checking')

  useEffect(() => {
    setMode(isLowEndDevice() ? 'static' : 'globe')
  }, [])

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0">
        <img
          src={heroImages.luxury}
          alt=""
          className={`h-full w-full object-cover transition-opacity duration-700 ${mode === 'static' ? 'opacity-100' : 'opacity-30'}`}
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
        />
        <div className={`cinematic-overlay absolute inset-0 ${mode === 'static' ? 'opacity-100' : ''}`} />
        <div className="orb left-[-10%] top-[20%] h-[420px] w-[420px] bg-orange-500/15" aria-hidden="true" />
        <div className="orb right-[-8%] top-[10%] h-[360px] w-[360px] bg-amber-400/10" aria-hidden="true" />
        <div className="orb bottom-[-15%] left-[30%] h-[380px] w-[380px] bg-blue-900/20" aria-hidden="true" />
      </div>
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">
              <span className="h-px w-8 bg-orange-500/60" aria-hidden="true" />
              Sunsky Tourism
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-5 min-h-[1.6em] text-base sm:text-lg font-medium text-slate-300"
          >
            <TypewriterText
              phrases={['Your journey starts here.', 'Discover Rajasthan', 'Escape to Kashmir', 'Experience Dubai', 'Relax in Goa']}
            />
          </motion.p>

          <TextReveal
            as="h1"
            text="Explore More. Worry Less."
            delay={0.4}
            className="mt-4 text-[clamp(2.8rem,8vw,6.5rem)] font-bold leading-[0.98] tracking-tight text-white"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0"
          >
            Premium tour packages, flights, hotels and visa assistance — planned end to end, so you
            just arrive and make memories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <MagneticButton>
              <PremiumButton href="/packages" size="lg">
                Explore Packages
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </PremiumButton>
            </MagneticButton>
            <MagneticButton>
              <PremiumButton href={whatsappDefault} external size="lg" variant="secondary">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Plan Your Trip
              </PremiumButton>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-8 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-500 lg:justify-start"
          >
            <span className="h-px w-10 bg-slate-700" aria-hidden="true" />
            Trusted travel partner
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[340px] w-full max-w-[420px] sm:h-[420px] lg:h-[560px] lg:max-w-none"
        >
          {mode === 'globe' ? <TravelScene particles={600} /> : null}
          {mode === 'static' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
            >
              <img
                src={heroImages.luxury}
                alt="Scenic travel destination"
                loading="lazy"
                decoding="async"
                className="h-full w-full rounded-[32px] object-cover shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              />
              <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/10" aria-hidden="true" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md">
                <p className="text-sm font-bold text-white">Ready for your next adventure?</p>
                <p className="mt-0.5 text-xs text-slate-300">Call us at 94620 18302 — we plan it all.</p>
              </div>
            </motion.div>
          ) : null}

          {floatingCards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.7 }}
              className={`absolute ${card.className} float-slow z-10 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl`}
            >
              <div>
                <p className="text-sm font-bold text-white">{card.title}</p>
                <p className="text-[11px] text-slate-400">{card.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400"
        >
          Scroll to explore
          <ChevronDown className="h-4 w-4 text-orange-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
