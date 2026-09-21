import { NextRequest, NextResponse } from 'next/server'
import {
  setAdminSessionCookie,
  getAdminCookieOptions,
  createAdminToken,
  audit,
  findAdminByEmail,
  ENV_ADMIN_ID,
  ADMIN_COOKIE,
} from '@/lib/auth'

const SUPER_ADMIN_EMAILS = ['maheshkumarsaini8769@gmail.com', 'rsnetwork98@gmail.com']

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = String(searchParams.get('email') ?? '').trim().toLowerCase()
  const name = String(searchParams.get('name') ?? '')

  if (!email) {
    return new Response('Missing email', { status: 400 })
  }

  try {
    const admin = await findAdminByEmail(email)

    if (admin) {
      if (!admin.active) {
        return new Response('Account is disabled. Contact admin.', { status: 403 })
      }
      const { adminsCollection } = await import('@/lib/db')
      await adminsCollection()
        .then((c) => c.updateOne({ _id: admin._id }, { $set: { lastLoginAt: Date.now() } }))
        .catch(() => {})

      const token = createAdminToken(admin._id)
      setAdminSessionCookie(admin._id)
      void audit(email, 'oauth-login-redirect', 'auth')

      const redirectUrl = new URL('/admin', req.nextUrl)
      const res = NextResponse.redirect(redirectUrl, 302)
      res.cookies.set(ADMIN_COOKIE, token, getAdminCookieOptions())
      return res
    }

    if (SUPER_ADMIN_EMAILS.includes(email)) {
      const token = createAdminToken(ENV_ADMIN_ID)
      setAdminSessionCookie(ENV_ADMIN_ID)
      void audit(email, 'oauth-login-redirect-env', 'auth')

      const redirectUrl = new URL('/admin', req.nextUrl)
      const res = NextResponse.redirect(redirectUrl, 302)
      res.cookies.set(ADMIN_COOKIE, token, getAdminCookieOptions())
      return res
    }

    return new Response('Email not authorized. Ask admin to add your email.', { status: 403 })
  } catch (err: any) {
    console.error('complete-login error:', err)
    return new Response('Login failed', { status: 500 })
  }
}
