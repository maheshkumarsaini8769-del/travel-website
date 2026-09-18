'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const SCRIPT_URL = 'https://unpkg.com/zenuxs-oauth@7/dist/zenux-oauth.min.js'

function getTokenFromHash(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash
  if (!hash || !hash.includes('access_token')) return null
  try {
    const params = new URLSearchParams(hash.substring(1))
    return params.get('access_token')
  } catch {
    return null
  }
}

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [redirectUri, setRedirectUri] = useState('')
  const authRef = useRef<HTMLElement | null>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/admin/login`)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`)
    if (existing) { setScriptLoaded(true); return }
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => { setError('Failed to load login SDK. Please refresh.'); setReady(true) }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!scriptLoaded || processedRef.current) return
    const token = getTokenFromHash()
    if (token) {
      processedRef.current = true
      setBusy(true)
      window.history.replaceState(null, '', window.location.pathname)
      const oauth = new (window as any).ZenuxOAuth({ clientId: '1fe396337ca4c424' })
      oauth.getUserInfo({ access_token: token })
        .then((user: any) => {
          const email = user?.email ?? ''
          if (!email) { setBusy(false); setError('Could not read email.'); return }
          window.location.href = `/api/auth/complete-login?email=${encodeURIComponent(email)}&name=${encodeURIComponent(user?.name ?? '')}`
        })
        .catch((err: any) => { setBusy(false); setError(err?.message ?? 'Login failed.') })
    } else {
      setReady(true)
    }
  }, [scriptLoaded])

  const handleSuccess = useCallback(async (e: Event) => {
    if (processedRef.current) return
    const detail = (e as CustomEvent).detail
    if (!detail?.access_token) return
    processedRef.current = true
    setBusy(true)
    try {
      const oauth = new (window as any).ZenuxOAuth({ clientId: '1fe396337ca4c424' })
      const user: any = await oauth.getUserInfo({ access_token: detail.access_token })
      const email = user?.email ?? ''
      if (!email) { setBusy(false); setError('Could not read email.'); return }
      window.location.href = `/api/auth/complete-login?email=${encodeURIComponent(email)}&name=${encodeURIComponent(user?.name ?? '')}`
    } catch (err: any) {
      setBusy(false)
      setError(err?.message ?? 'Login failed.')
    }
  }, [])

  const handleError = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail
    setError(detail?.message ?? 'Login failed')
  }, [])

  useEffect(() => {
    const el = authRef.current
    if (!el || !scriptLoaded) return
    el.addEventListener('success', handleSuccess, { capture: true })
    el.addEventListener('error', handleError, { capture: true })
    return () => {
      el.removeEventListener('success', handleSuccess, { capture: true })
      el.removeEventListener('error', handleError, { capture: true })
    }
  }, [scriptLoaded, handleSuccess, handleError])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707]">
      <div className="w-full max-w-sm px-4">
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-center text-sm font-medium text-rose-400">
            <p>{error}</p>
            <button onClick={() => { setError(''); setBusy(false); processedRef.current = false }} className="mt-2 underline text-xs">Try again</button>
          </div>
        )}

        {busy && !error && (
          <p className="mb-4 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-center text-sm font-medium text-orange-400">
            Signing you in...
          </p>
        )}

        {ready && !busy && scriptLoaded && redirectUri ? (
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
          !busy && !error && <p className="text-center text-sm text-slate-500">Loading login...</p>
        )}
      </div>
    </div>
  )
}
