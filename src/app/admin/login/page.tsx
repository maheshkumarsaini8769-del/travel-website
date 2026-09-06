'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

const ALLOWED_EMAIL = 'maheshkumarsaini8769@gmail.com'

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [authReady, setAuthReady] = useState(false)
  const [redirectUri, setRedirectUri] = useState('')
  const router = useRouter()
  const authRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/admin/login`)
  }, [])

  useEffect(() => {
    const el = authRef.current
    if (!el || !authReady) return

    const onSuccess = async (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail?.access_token) return

      try {
        const oauth = new (window as any).ZenuxOAuth({ clientId: '1fe396337ca4c424' })
        const user = await oauth.getUserInfo({ access_token: detail.access_token })
        const email = user?.email ?? ''

        if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
          setError(`Access denied.`)
          return
        }

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
    }

    const onError = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setError(detail?.message ?? 'Login failed')
    }

    el.addEventListener('success', onSuccess)
    el.addEventListener('error', onError)
    return () => {
      el.removeEventListener('success', onSuccess)
      el.removeEventListener('error', onError)
    }
  }, [router, authReady])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707]">
      <div className="w-full max-w-sm px-4">
        {error && <p className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-center text-sm font-medium text-rose-400">{error}</p>}

        {authReady ? (
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
          <p className="text-center text-sm text-slate-500">Loading...</p>
        )}
      </div>

      <Script
        src="https://unpkg.com/zenuxs-oauth@7/dist/zenux-oauth.min.js"
        strategy="afterInteractive"
        onLoad={() => setAuthReady(true)}
      />
    </div>
  )
}
