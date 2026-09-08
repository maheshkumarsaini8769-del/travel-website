'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const SCRIPT_URL = 'https://unpkg.com/zenuxs-oauth@7/dist/zenux-oauth.min.js'

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [redirectUri, setRedirectUri] = useState('')
  const router = useRouter()
  const authRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/admin/login`)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return

    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`)
    if (existing) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => setError('Failed to load login. Please refresh.')
    document.body.appendChild(script)
  }, [])

  const handleSuccess = useCallback(async (e: Event) => {
    const detail = (e as CustomEvent).detail
    if (!detail?.access_token) return

    try {
      const oauth = new (window as any).ZenuxOAuth({ clientId: '1fe396337ca4c424' })
      const user = await oauth.getUserInfo({ access_token: detail.access_token })
      const email = user?.email ?? ''

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, name: user?.name, oauth: true }),
      })

      if (res.ok) {
        router.replace('/admin')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Login failed.')
      }
    } catch {
      setError('Login failed.')
    }
  }, [router])

  const handleError = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail
    setError(detail?.message ?? 'Login failed')
  }, [])

  useEffect(() => {
    const el = authRef.current
    if (!el || !scriptLoaded) return

    el.addEventListener('success', handleSuccess)
    el.addEventListener('error', handleError)
    return () => {
      el.removeEventListener('success', handleSuccess)
      el.removeEventListener('error', handleError)
    }
  }, [scriptLoaded, handleSuccess, handleError])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707]">
      <div className="w-full max-w-sm px-4">
        {error && (
          <p className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-center text-sm font-medium text-rose-400">
            {error}
          </p>
        )}

        {scriptLoaded && redirectUri ? (
          <zenuxs-auth
            ref={authRef}
            client-id="1fe396337ca4c424"
            redirect-uri={redirectUri}
            scope="openid profile email"
            theme="dark"
            height="60px"
            auto-redirect="false"
          />
        ) : (
          <p className="text-center text-sm text-slate-500">Loading login...</p>
        )}
      </div>
    </div>
  )
}
