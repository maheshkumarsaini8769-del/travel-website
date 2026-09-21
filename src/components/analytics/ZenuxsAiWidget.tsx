'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function ZenuxsAiWidget() {
  useEffect(() => {
    // Intercept sendBeacon for aistudio analytics to avoid CORS credentials mismatch
    if (typeof window === 'undefined' || !window.navigator?.sendBeacon) return

    const origSendBeacon = window.navigator.sendBeacon.bind(window.navigator)
    window.navigator.sendBeacon = function (url: string | URL, data?: BodyInit | null) {
      try {
        const urlStr = typeof url === 'string' ? url : url.toString()
        if (urlStr.includes('aistudio.zenuxs.site') && data instanceof Blob && data.type === 'application/json') {
          // Re-wrap as text/plain to avoid credentialed CORS preflight block
          const textBlob = new Blob([data], { type: 'text/plain;charset=UTF-8' })
          return origSendBeacon(url, textBlob)
        }
      } catch {}
      return origSendBeacon(url, data)
    }
  }, [])

  return (
    <Script
      src="https://aistudio.zenuxs.site/inter/widget.js?token=zinter-8c86b5d3245341c2b4fda3c47242b42b"
      strategy="lazyOnload"
    />
  )
}
