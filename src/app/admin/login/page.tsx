'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const SCRIPT_URL = 'https://unpkg.com/zenuxs-oauth@7/dist/zenux-oauth.min.js'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s`)), ms)
    promise.then((v) => { clearTimeout(timer); resolve(v) }, (e) => { clearTimeout(timer); reject(e) })
  })
}

async function doLogin(email: string, name: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, name, oauth: true }),
  })
  const data = await res.json().catch(() => ({}))
  if (res.ok) {
    window.location.replace('/admin')
    return { ok: true }
  }
  return { ok: false, error: data.error ?? 'Login failed.' }
}

async function processToken(accessToken: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(window as any).ZenuxOAuth) {
      return { ok: false, error: 'OAuth library not loaded. Please refresh.' }
    }
    const oauth = new (window as any).ZenuxOAuth({ clientId: '1fe396337ca4c424' })
    const user: any = await withTimeout(oauth.getUserInfo({ access_token: accessToken }), 15000)
    const email: string = user?.email ?? ''
    if (!email) return { ok: false, error: 'Could not read email from OAuth response.' }
    return await doLogin(email, user?.name ?? '')
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Login failed.' }
  }
}

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
      processToken(token).then((r) => {
        if (!r.ok) { setBusy(false); setError(r.error ?? 'Login failed.') }
      })
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
    const r = await processToken(detail.access_token)
    if (!r.ok) { setBusy(false); setError(r.error ?? 'Login failed.') }
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
