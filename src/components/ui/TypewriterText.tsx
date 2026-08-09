'use client'

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/helpers'

interface TypewriterTextProps {
  phrases: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  pauseMs?: number
  loop?: boolean
}

export default function TypewriterText({
  phrases,
  className = '',
  typeSpeed = 55,
  deleteSpeed = 28,
  pauseMs = 1800,
  loop = true,
}: TypewriterTextProps) {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')
  const phraseIndex = useRef(0)
  const charIndex = useRef(0)
  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      setText(phrases[0] ?? '')
      return
    }
    if (phrases.length === 0) return

    const current = phrases[phraseIndex.current % phrases.length]

    const tick = () => {
      if (phase === 'typing') {
        charIndex.current += 1
        setText(current.slice(0, charIndex.current))
        if (charIndex.current >= current.length) setPhase('pausing')
      } else if (phase === 'pausing') {
        setPhase('deleting')
      } else {
        charIndex.current -= 1
        setText(current.slice(0, charIndex.current))
        if (charIndex.current <= 0) {
          phraseIndex.current += 1
          if (!loop && phraseIndex.current >= phrases.length) {
            setText(current)
            return
          }
          setPhase('typing')
        }
      }
    }

    const delay = phase === 'typing' ? typeSpeed : phase === 'deleting' ? deleteSpeed : pauseMs
    const id = setTimeout(tick, delay)
    return () => clearTimeout(id)
  }, [text, phase, phrases, typeSpeed, deleteSpeed, pauseMs, loop, reduced])

  return (
    <span className={className}>
      {text}
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  )
}
