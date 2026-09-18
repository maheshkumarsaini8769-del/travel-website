import { NextRequest } from 'next/server'
import { setAdminSessionCookie, audit, findAdminByEmail, ENV_ADMIN_ID } from '@/lib/auth'

const SUPER_ADMIN_EMAIL = 'maheshkumarsaini8769@gmail.com'

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
        .then((c) => c.updateOne({ _id: admin!._id }, { $set: { lastLoginAt: Date.now() } }))
        .catch(() => {})
      setAdminSessionCookie(admin._id)
      void audit(email, 'oauth-login-redirect', 'auth')
      return Response.redirect(new URL('/admin', req.url), 302)
    }

    if (email === SUPER_ADMIN_EMAIL) {
      setAdminSessionCookie(ENV_ADMIN_ID)
      void audit(email, 'oauth-login-redirect-env', 'auth')
      return Response.redirect(new URL('/admin', req.url), 302)
    }

    return new Response('Email not authorized. Ask admin to add your email.', { status: 403 })
  } catch {
    return new Response('Login failed', { status: 500 })
  }
}
