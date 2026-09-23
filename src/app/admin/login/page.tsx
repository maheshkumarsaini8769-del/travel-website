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
  const oauthRef = useRef<any>(null)
  const processedRef = useRef(false)

  // Redirect to /admin if already logged in via server session
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
      setReady(true)
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

        // Fallback redirect if POST returned unexpected response
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

  // 1. Check immediately and periodically if tokens already exist in localStorage (e.g. from active session in screenshot)
  useEffect(() => {
    const checkActiveSession = () => {
      if (processedRef.current) return
      try {
        const raw = localStorage.getItem('zenux_oauth_tokens') || sessionStorage.getItem('zenux_oauth_tokens')
        if (raw) {
          const parsed = JSON.parse(raw)
          const token = parsed?.access_token || parsed?.tokens?.access_token || parsed?.id_token
          if (token) {
            processedRef.current = true
            setBusy(true)
            setBusyMessage('Opening Admin Panel...')
            processTokens(parsed).then((authData) => {
              if (authData.email) {
                executeLogin(authData)
              } else {
                setBusy(false)
                processedRef.current = false
              }
            })
          }
        }
      } catch {}
    }

    checkActiveSession()
    const timer = setInterval(checkActiveSession, 1000)
    return () => clearInterval(timer)
  }, [processTokens, executeLogin])

  // 2. Direct handleCallback check if code= exists in browser URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const href = window.location.href
    if (href.includes('?code=') || href.includes('&code=')) {
      if (processedRef.current) return
      processedRef.current = true
      setBusy(true)
      setBusyMessage('Completing authentication...')
      const ZenuxOAuthClass = (window as any).ZenuxOAuth
      const oauth = oauthRef.current || (ZenuxOAuthClass ? new ZenuxOAuthClass({ clientId: CLIENT_ID, redirectUri }) : null)
      if (oauth && typeof oauth.handleCallback === 'function') {
        oauth
          .handleCallback(href, { notifyParent: false })
          .then(async (tokens: any) => {
            const authData = await processTokens(tokens)
            if (authData.email) {
              await executeLogin(authData)
            } else {
              setBusy(false)
              processedRef.current = false
              setError('Could not verify email from authentication.')
            }
          })
          .catch((err: any) => {
            setBusy(false)
            processedRef.current = false
            setError(err?.message || 'Callback failed.')
          })
      }
    }
  }, [redirectUri, processTokens, executeLogin])

  // 3. Document-level and Window-level listeners for custom events & iframe postMessages
  useEffect(() => {
    const handleAuthEvent = async (e: Event) => {
      if (processedRef.current) return
      const detail = (e as CustomEvent).detail
      if (!detail) return

      processedRef.current = true
      setBusy(true)
      setBusyMessage('Opening Admin Panel...')

      try {
        const authData = await processTokens(detail?.tokens || detail?.result || detail)
        if (authData.email) {
          await executeLogin(authData)
        } else {
          setBusy(false)
          processedRef.current = false
          setError('Could not verify email. Please try again.')
        }
      } catch (err: any) {
        setBusy(false)
        processedRef.current = false
        setError(err?.message ?? 'Login failed.')
      }
    }

    const handleRedirect = () => {
      window.location.replace('/admin')
    }

    const handleWindowMessage = async (event: MessageEvent) => {
      const data = event.data
      if (!data || typeof data !== 'object') return
      const type = String(data.type || '')

      if ((type === 'zenux:navigate' || type.includes('zenux_oauth_success')) && data.url) {
        if (data.url.includes('?code=') || data.url.includes('&code=')) {
          if (processedRef.current) return
          processedRef.current = true
          setBusy(true)
          setBusyMessage('Completing login...')
          try {
            const ZenuxOAuthClass = (window as any).ZenuxOAuth
            const oauth = oauthRef.current || (ZenuxOAuthClass ? new ZenuxOAuthClass({ clientId: CLIENT_ID, redirectUri }) : null)
            if (oauth) {
              const tokens = await oauth.handleCallback(data.url, { notifyParent: false })
              const authData = await processTokens(tokens)
              if (authData.email) {
                await executeLogin(authData)
                return
              }
            }
          } catch (err: any) {
            setBusy(false)
            processedRef.current = false
            setError(err?.message ?? 'Login failed.')
            return
          }
        }
      }

      if (type.includes('zenux_oauth_success') || type.includes('auth_success') || type.includes('auth-success') || data.tokens) {
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

    document.addEventListener('success', handleAuthEvent)
    document.addEventListener('auth-success', handleAuthEvent)
    document.addEventListener('redirect', handleRedirect)
    document.addEventListener('auth-redirect', handleRedirect)
    window.addEventListener('message', handleWindowMessage)

    return () => {
      document.removeEventListener('success', handleAuthEvent)
      document.removeEventListener('auth-success', handleAuthEvent)
      document.removeEventListener('redirect', handleRedirect)
      document.removeEventListener('auth-redirect', handleRedirect)
      window.removeEventListener('message', handleWindowMessage)
    }
  }, [processTokens, executeLogin, redirectUri])

  // Inbuilt popup login button handler
  const handlePopupLogin = async () => {
    const ZenuxOAuthClass = (window as any).ZenuxOAuth
    const oauth = oauthRef.current || (ZenuxOAuthClass ? new ZenuxOAuthClass({
      clientId: CLIENT_ID,
      redirectUri,
    }) : null)
    if (!oauth) return

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
                client-id={CLIENT_ID}
                redirect-uri={redirectUri}
                redirect-url="/admin"
                auto-redirect="true"
                redirect-delay="0"
                scope="openid profile email"
                theme="dark"
                height="500px"
                width="100%"
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
