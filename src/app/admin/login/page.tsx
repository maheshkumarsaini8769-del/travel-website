'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const SCRIPT_URL = 'https://unpkg.com/zenuxs-oauth@7/dist/zenux-oauth.min.js'

async function processToken(accessToken: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const oauth = new (window as any).ZenuxOAuth({ clientId: '1fe396337ca4c424' })
    const user = await oauth.getUserInfo({ access_token: accessToken })
    const email = user?.email ?? ''
    if (!email) return { ok: false, error: 'Could not read email from OAuth.' }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, name: user?.name, oauth: true }),
    })

    if (res.ok) {
      window.location.replace('/admin')
      return { ok: true }
    }
    const data = await res.json().catch(() => ({}))
    return { ok: false, error: data.error ?? 'Login failed.' }
  } catch {
    return { ok: false, error: 'Login failed.' }
  }
}

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [redirectUri, setRedirectUri] = useState('')
  const authRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/admin/login`)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('access_token')
      if (token) {
        setBusy(true)
        processToken(token).then((r) => {
          if (!r.ok) setError(r.error ?? 'Login failed.')
        })
        return
      }
    }
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
    setBusy(true)
    const r = await processToken(detail.access_token)
    if (!r.ok) {
      setBusy(false)
      setError(r.error ?? 'Login failed.')
    }
  }, [])

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

        {busy && !error && (
          <p className="mb-4 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-center text-sm font-medium text-orange-400">
            Signing you in...
          </p>
        )}

        {scriptLoaded && redirectUri && !busy ? (
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
          !busy && <p className="text-center text-sm text-slate-500">Loading login...</p>
        )}
      </div>
    </div>
  )
}
