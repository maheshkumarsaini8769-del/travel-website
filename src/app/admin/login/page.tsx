'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const SCRIPT_URL = 'https://unpkg.com/zenuxs-oauth@7.0.0/dist/zenux-oauth.min.js'
const CLIENT_ID = process.env.NEXT_PUBLIC_ZENUX_CLIENT_ID || '1fe396337ca4c424'

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [busyMessage, setBusyMessage] = useState('Signing you in...')
  const [ready, setReady] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [redirectUri, setRedirectUri] = useState('')
  const authRef = useRef<HTMLElement | null>(null)
  const oauthRef = useRef<any>(null)
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

    const initSDK = () => {
      const ZenuxOAuthClass = (window as any).ZenuxOAuth
      if (ZenuxOAuthClass && !oauthRef.current && redirectUri) {
        oauthRef.current = new ZenuxOAuthClass({
          clientId: CLIENT_ID,
          redirectUri,
          scopes: 'openid profile email',
          theme: 'dark',
        })
      }
      setScriptLoaded(true)
    }

    if ((window as any).ZenuxOAuth || customElements.get('zenuxs-auth')) {
      initSDK()
      return
    }

    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`)
    if (existing) {
      existing.addEventListener('load', initSDK)
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      if (active) initSDK()
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
  }, [redirectUri])

  const executeLogin = useCallback(
    async (authData: { email: string; name?: string; accessToken?: string; idToken?: string }) => {
      setBusy(true)
      setBusyMessage(`Signing in as ${authData.email || 'Admin'}...`)
      setError('')

      try {
        if (typeof document !== 'undefined') {
          if (authData.accessToken) {
            document.cookie = `zenux_access_token=${encodeURIComponent(authData.accessToken)}; Path=/; Max-Age=604800; SameSite=Lax`
          }
          if (authData.idToken) {
            document.cookie = `zenux_id_token=${encodeURIComponent(authData.idToken)}; Path=/; Max-Age=604800; SameSite=Lax`
          }
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (authData.accessToken) {
          headers['Authorization'] = `Bearer ${authData.accessToken}`
        }

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'same-origin',
          headers,
          body: JSON.stringify({
            email: authData.email,
            name: authData.name,
            accessToken: authData.accessToken,
            idToken: authData.idToken,
            oauth: true,
          }),
        })

        const data = await res.json().catch(() => ({}))

        if (res.ok && data.ok) {
          setBusyMessage('Opening Admin Panel...')
          window.location.replace('/admin')
          return
        }

        if (data?.error) {
          setBusy(false)
          processedRef.current = false
          setError(data.error)
          return
        }

        // Fallback redirect if POST failed
        window.location.href = `/api/auth/complete-login?email=${encodeURIComponent(authData.email)}&name=${encodeURIComponent(authData.name || '')}&accessToken=${encodeURIComponent(authData.accessToken || '')}`
      } catch {
        window.location.href = `/api/auth/complete-login?email=${encodeURIComponent(authData.email)}&name=${encodeURIComponent(authData.name || '')}&accessToken=${encodeURIComponent(authData.accessToken || '')}`
      }
    },
    []
  )

  // Extract user info strictly using ZenuxOAuth inbuilt functions
  const processTokens = useCallback(
    async (tokens: any) => {
      const oauth = oauthRef.current || new ((window as any).ZenuxOAuth)({
        clientId: CLIENT_ID,
        redirectUri,
      })
      oauthRef.current = oauth

      let email = ''
      let name = ''
      const accessToken =
        tokens?.access_token ||
        tokens?.accessToken ||
        tokens?.tokens?.access_token ||
        (typeof tokens === 'string' ? tokens : '')
      const idToken =
        tokens?.id_token ||
        tokens?.idToken ||
        tokens?.tokens?.id_token ||
        ''

      if (accessToken && typeof oauth.setTokens === 'function') {
        oauth.setTokens({
          access_token: accessToken,
          id_token: idToken,
          ...(typeof tokens === 'object' && tokens ? tokens : {}),
        })
      }

      // 1. Inbuilt getUserInfo()
      if (accessToken && typeof oauth.getUserInfo === 'function') {
        try {
          const info = await oauth.getUserInfo()
          if (info?.email) {
            email = String(info.email).trim().toLowerCase()
          }
          if (info?.name || info?.nickname) {
            name = String(info.name || info.nickname).trim()
          }
        } catch {}
      }

      // 2. Inbuilt decodeJWT() on id_token
      if (!email && idToken && typeof oauth.decodeJWT === 'function') {
        try {
          const payload = oauth.decodeJWT(idToken)
          if (payload?.email) {
            email = String(payload.email).trim().toLowerCase()
          }
          if (payload?.name || payload?.nickname) {
            name = String(payload.name || payload.nickname).trim()
          }
        } catch {}
      }

      // 3. Inbuilt decodeJWT() on access_token
      if (!email && accessToken && typeof oauth.decodeJWT === 'function') {
        try {
          const payload = oauth.decodeJWT(accessToken)
          if (payload?.email) {
            email = String(payload.email).trim().toLowerCase()
          }
          if (payload?.name || payload?.nickname) {
            name = String(payload.name || payload.nickname).trim()
          }
        } catch {}
      }

      // 4. Inbuilt user object fallback
      if (!email && tokens?.user?.email) {
        email = String(tokens.user.email).trim().toLowerCase()
        name = String(tokens.user.name || name)
      } else if (!email && tokens?.email) {
        email = String(tokens.email).trim().toLowerCase()
        name = String(tokens.name || name)
      }

      return {
        email,
        name: name || (email ? email.split('@')[0] : 'Admin'),
        accessToken,
        idToken,
      }
    },
    [redirectUri]
  )

  // Handle URL parameters using inbuilt oauth.init()
  useEffect(() => {
    if (!scriptLoaded || !oauthRef.current || processedRef.current) return

    const oauth = oauthRef.current
    if (typeof oauth.init !== 'function') {
      setReady(true)
      return
    }

    oauth
      .init()
      .then(async (tokens: any) => {
        const hasTokens =
          tokens?.access_token ||
          tokens?.id_token ||
          tokens?.tokens?.access_token ||
          tokens?.tokens?.id_token
        if (hasTokens) {
          processedRef.current = true
          setBusy(true)
          setBusyMessage('Processing authentication...')
          const authData = await processTokens(tokens)
          if (authData.email) {
            await executeLogin(authData)
          } else {
            setBusy(false)
            processedRef.current = false
            setError('Could not verify email from authentication.')
          }
        } else {
          setReady(true)
        }
      })
      .catch(() => {
        setReady(true)
      })
  }, [scriptLoaded, processTokens, executeLogin])

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
        const authData = await processTokens(detail)
        if (!authData.email) {
          setBusy(false)
          processedRef.current = false
          setError('Could not verify email. Please try again.')
          return
        }
        await executeLogin(authData)
      } catch (err: any) {
        setBusy(false)
        processedRef.current = false
        setError(err?.message ?? 'Login failed.')
      }
    },
    [processTokens, executeLogin]
  )

  const handleError = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail
    processedRef.current = false
    setBusy(false)
    setError(detail?.message ?? 'Authentication error occurred.')
  }, [])

  // Inbuilt popup login button handler
  const handlePopupLogin = async () => {
    const oauth = oauthRef.current || new ((window as any).ZenuxOAuth)({
      clientId: CLIENT_ID,
      redirectUri,
    })
    oauthRef.current = oauth

    setBusy(true)
    setBusyMessage('Opening login popup...')
    setError('')

    try {
      const tokens = await oauth.login({ mode: 'popup' })
      if (tokens) {
        const authData = await processTokens(tokens)
        if (authData.email) {
          await executeLogin(authData)
          return
        }
      }
      setBusy(false)
    } catch (err: any) {
      setBusy(false)
      if (err?.code !== 'AUTH_CANCELLED') {
        setError(err?.message ?? 'Popup authentication failed.')
      }
    }
  }

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
          const authData = await processTokens(data.tokens || data)
          if (authData.email) {
            await executeLogin(authData)
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
  }, [scriptLoaded, handleSuccess, handleError, processTokens, executeLogin])

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
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex justify-center min-h-[500px]">
              <zenuxs-auth
                ref={authRef}
                client-id={CLIENT_ID}
                redirect-uri={redirectUri}
                scope="openid profile email"
                theme="dark"
                height="500px"
                width="100%"
                auto-redirect="false"
              />
            </div>

            <div className="w-full flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              onClick={handlePopupLogin}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Continue in Popup Window
            </button>
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
