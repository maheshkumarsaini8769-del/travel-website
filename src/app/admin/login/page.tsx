'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const SCRIPT_URL = 'https://unpkg.com/zenuxs-oauth@7.0.0/dist/zenux-oauth.min.js'
const CLIENT_ID = '1fe396337ca4c424'

function decodeJwt(token?: string | null): any {
  if (!token || typeof token !== 'string') return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function getTokensFromUrl(): { accessToken?: string; idToken?: string } | null {
  if (typeof window === 'undefined') return null

  // Check URL hash first
  const hash = window.location.hash
  if (hash && (hash.includes('access_token') || hash.includes('id_token'))) {
    try {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token') || undefined
      const idToken = params.get('id_token') || undefined
      if (accessToken || idToken) return { accessToken, idToken }
    } catch {}
  }

  // Check search query params
  const search = window.location.search
  if (search && (search.includes('access_token') || search.includes('id_token'))) {
    try {
      const params = new URLSearchParams(search)
      const accessToken = params.get('access_token') || undefined
      const idToken = params.get('id_token') || undefined
      if (accessToken || idToken) return { accessToken, idToken }
    } catch {}
  }

  return null
}

async function extractUserInfo(detail: any): Promise<{ email: string; name: string } | null> {
  if (!detail) return null

  // 1. Direct user object
  if (detail?.user?.email) {
    return {
      email: String(detail.user.email).trim().toLowerCase(),
      name: String(detail.user.name || detail.user.email.split('@')[0]),
    }
  }
  if (detail?.email) {
    return {
      email: String(detail.email).trim().toLowerCase(),
      name: String(detail.name || detail.email.split('@')[0]),
    }
  }

  // 2. Decode id_token JWT (instant, standard OpenID Connect payload)
  const tokens = detail?.tokens || detail
  const idToken = tokens?.id_token || tokens?.idToken || detail?.id_token || detail?.idToken
  if (idToken) {
    const payload = decodeJwt(idToken)
    if (payload?.email) {
      return {
        email: String(payload.email).trim().toLowerCase(),
        name: String(payload.name || payload.nickname || payload.email.split('@')[0]),
      }
    }
  }

  // 3. Use access token to fetch user profile
  const accessToken =
    tokens?.access_token ||
    tokens?.accessToken ||
    detail?.access_token ||
    detail?.accessToken ||
    (typeof detail === 'string' ? detail : null)
  if (accessToken) {
    // Attempt via ZenuxOAuth SDK instance
    try {
      const ZenuxClass = (window as any).ZenuxOAuth
      if (ZenuxClass) {
        const oauth = new ZenuxClass({ clientId: CLIENT_ID })
        if (typeof oauth.setTokens === 'function') {
          oauth.setTokens({ access_token: accessToken })
        }
        if (typeof oauth.getUserInfo === 'function') {
          const info = await oauth.getUserInfo()
          if (info?.email) {
            return {
              email: String(info.email).trim().toLowerCase(),
              name: String(info.name || info.email.split('@')[0]),
            }
          }
        }
      }
    } catch {}

    // Direct fetch to userinfo endpoint
    try {
      const res = await fetch('https://api.auth.zenuxs.in/oauth/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })
      if (res.ok) {
        const info = await res.json()
        if (info?.email) {
          return {
            email: String(info.email).trim().toLowerCase(),
            name: String(info.name || info.email.split('@')[0]),
          }
        }
      }
    } catch {}
  }

  return null
}

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [busyMessage, setBusyMessage] = useState('Signing you in...')
  const [ready, setReady] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [redirectUri, setRedirectUri] = useState('')
  const authRef = useRef<HTMLElement | null>(null)
  const processedRef = useRef(false)

  // Redirect to /admin if already logged in (silent check avoids 401 console error)
  useEffect(() => {
    fetch('/api/admin/me?check=1', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.authenticated && (data?.ok || data?.user)) {
          window.location.replace('/admin')
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUri(`${window.location.origin}/admin/login`)
    }
  }, [])

  // Load Zenuxs OAuth browser SDK via script tag
  useEffect(() => {
    let active = true

    if (typeof document === 'undefined') return

    // If custom element already defined or script exists
    if ((window as any).ZenuxOAuth || customElements.get('zenuxs-auth')) {
      setScriptLoaded(true)
      return
    }

    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`)
    if (existing) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      if (active) setScriptLoaded(true)
    }
    script.onerror = () => {
      if (active) {
        setError('Failed to load login SDK. Please refresh the page.')
        setReady(true)
      }
    }
    document.body.appendChild(script)

    return () => {
      active = false
    }
  }, [])

  const executeLogin = useCallback(async (userInfo: { email: string; name: string }) => {
    setBusy(true)
    setBusyMessage(`Signing in as ${userInfo.email}...`)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          oauth: true,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.ok) {
        setBusyMessage('Opening Admin Panel...')
        window.location.replace('/admin')
        return
      }

      // If server returned an authorization or disabled error
      if (data?.error) {
        setBusy(false)
        processedRef.current = false
        setError(data.error)
        return
      }

      // Fallback redirect if POST failed
      window.location.href = `/api/auth/complete-login?email=${encodeURIComponent(userInfo.email)}&name=${encodeURIComponent(userInfo.name)}`
    } catch {
      // Fallback to server complete-login endpoint
      window.location.href = `/api/auth/complete-login?email=${encodeURIComponent(userInfo.email)}&name=${encodeURIComponent(userInfo.name)}`
    }
  }, [])

  // Handle URL tokens from redirect
  useEffect(() => {
    if (!scriptLoaded || processedRef.current) return
    const urlTokens = getTokensFromUrl()
    if (urlTokens?.accessToken || urlTokens?.idToken) {
      processedRef.current = true
      setBusy(true)
      setBusyMessage('Processing authentication...')
      window.history.replaceState(null, '', window.location.pathname)

      extractUserInfo({
        access_token: urlTokens.accessToken,
        id_token: urlTokens.idToken,
      })
        .then((user) => {
          if (!user?.email) {
            setBusy(false)
            processedRef.current = false
            setError('Could not read email from login response.')
            return
          }
          void executeLogin(user)
        })
        .catch((err: any) => {
          setBusy(false)
          processedRef.current = false
          setError(err?.message ?? 'Login failed.')
        })
    } else {
      setReady(true)
    }
  }, [scriptLoaded, executeLogin])

  // Handle <zenuxs-auth> success event
  const handleSuccess = useCallback(
    async (e: Event) => {
      if (processedRef.current) return
      const detail = (e as CustomEvent).detail
      if (!detail) return

      processedRef.current = true
      setBusy(true)
      setBusyMessage('Completing login...')

      try {
        const user = await extractUserInfo(detail)
        if (!user?.email) {
          setBusy(false)
          processedRef.current = false
          setError('Could not verify email. Please try again.')
          return
        }
        await executeLogin(user)
      } catch (err: any) {
        setBusy(false)
        processedRef.current = false
        setError(err?.message ?? 'Login failed.')
      }
    },
    [executeLogin]
  )

  const handleError = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail
    processedRef.current = false
    setBusy(false)
    setError(detail?.message ?? 'Authentication error occurred.')
  }, [])

  useEffect(() => {
    const el = authRef.current
    if (!el || !scriptLoaded) return

    el.addEventListener('success', handleSuccess, { capture: true })
    el.addEventListener('auth-success', handleSuccess, { capture: true })
    el.addEventListener('error', handleError, { capture: true })

    const handleWindowMessage = async (event: MessageEvent) => {
      const data = event.data
      if (!data || typeof data !== 'object') return
      const type = String(data.type || '')
      if (type.includes('zenux_oauth_success') || type.includes('auth_success')) {
        if (processedRef.current) return
        processedRef.current = true
        setBusy(true)
        setBusyMessage('Completing login...')
        try {
          const user = await extractUserInfo(data)
          if (user?.email) {
            await executeLogin(user)
          } else {
            setBusy(false)
            processedRef.current = false
            setError('Could not verify email from authentication.')
          }
        } catch (err: any) {
          setBusy(false)
          processedRef.current = false
          setError(err?.message ?? 'Login failed.')
        }
      }
    }

    window.addEventListener('message', handleWindowMessage)

    return () => {
      el.removeEventListener('success', handleSuccess, { capture: true })
      el.removeEventListener('auth-success', handleSuccess, { capture: true })
      el.removeEventListener('error', handleError, { capture: true })
      window.removeEventListener('message', handleWindowMessage)
    }
  }, [scriptLoaded, handleSuccess, handleError, executeLogin])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0e] p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-black text-xl">
            S
          </div>
          <h1 className="text-xl font-bold text-white">Sunsky Admin Login</h1>
          <p className="mt-1 text-xs text-slate-400">Sign in with Zenuxs Auth to access the dashboard</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-center text-sm font-medium text-rose-400">
            <p>{error}</p>
            <button
              onClick={() => {
                setError('')
                setBusy(false)
                processedRef.current = false
              }}
              className="mt-2 text-xs font-semibold text-rose-300 underline hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {busy && !error && (
          <div className="my-6 flex flex-col items-center justify-center gap-3 py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="text-sm font-medium text-orange-400">{busyMessage}</p>
          </div>
        )}

        {ready && !busy && scriptLoaded && redirectUri ? (
          <div className="flex justify-center min-h-[500px]">
            <zenuxs-auth
              ref={authRef}
              client-id={CLIENT_ID}
              redirect-uri={redirectUri}
              scope="openid profile email"
              theme="dark"
              height="500px"
              width="100%"
              auto-redirect="true"
              redirect-url="/admin/dashboard"
              redirect-delay="1"
            />
          </div>
        ) : (
          !busy &&
          !error && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-600 border-t-orange-500" />
              <p className="text-xs text-slate-500">Loading Zenuxs Auth...</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
