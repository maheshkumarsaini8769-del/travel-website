'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { whatsappDefault, telPrimary } from '@/lib/helpers'

export default function FloatingButtons() {
  const [waTip, setWaTip] = useState(false)
  const [callTip, setCallTip] = useState(false)

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {callTip && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="rounded-full border border-white/10 bg-black/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
          >
            Call us now
          </motion.span>
        )}
      </AnimatePresence>
      <motion.a
        href={telPrimary}
        onMouseEnter={() => setCallTip(true)}
        onMouseLeave={() => setCallTip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20 sm:h-[54px] sm:w-[54px]"
        aria-label="Call Sunsky Tourism"
      >
        <Phone className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
      </motion.a>

      <div className="flex flex-col items-end gap-2">
        <AnimatePresence>
          {waTip && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="rounded-full border border-white/10 bg-black/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
            >
              Chat on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>
        <motion.a
          href={whatsappDefault}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setWaTip(true)}
          onMouseLeave={() => setWaTip(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_35px_rgba(37,211,102,0.4)] sm:h-[60px] sm:w-[60px]"
          aria-label="Chat with Sunsky Tourism on WhatsApp"
        >
          <span className="absolute inset-0 animate-wa-pulse rounded-full bg-[#25D366]/60" aria-hidden="true" />
          <MessageCircle className="relative h-6 w-6 sm:h-7 sm:w-7" />
        </motion.a>
      </div>
    </div>
  )
}
