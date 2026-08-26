'use client'

import { useEffect } from 'react'

export default function WarningSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const originalWarn = console.warn
    console.warn = (...args) => {
      const msg = args[0]
      if (
        typeof msg === 'string' &&
        msg.includes('Support for defaultProps will be removed') &&
        msg.includes('YAxis')
      ) {
        return
      }
      originalWarn.apply(console, args)
    }
    return () => { console.warn = originalWarn }
  }, [])

  return null
}