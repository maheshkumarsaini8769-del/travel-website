import { NextRequest, NextResponse } from 'next/server'
import ZenuxOAuth from 'zenuxs-oauth'
import {
  setAdminSessionCookie,
  getAdminCookieOptions,
  createAdminToken,
  createAdminFromEmail,
  audit,
  findAdminByEmail,
  ENV_ADMIN_ID,
  ADMIN_COOKIE,
} from '@/lib/auth'

const oauth = new ZenuxOAuth({
  clientId: process.env.NEXT_PUBLIC_ZENUX_CLIENT_ID || '1fe396337ca4c424',
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  let email = String(searchParams.get('email') ?? '').trim().toLowerCase()
  let name = String(searchParams.get('name') ?? '').trim()
  const accessToken = searchParams.get('accessToken') || searchParams.get('access_token')
  const idToken = searchParams.get('idToken') || searchParams.get('id_token')

  if (accessToken) {
    try {
      ;(oauth as any).setTokens({ access_token: accessToken })
      const userInfo = await oauth.getUserInfo()
      if (userInfo?.email) email = String(userInfo.email).trim().toLowerCase()
      if (userInfo?.name) name = String(userInfo.name).trim()
    } catch {
      if (idToken) {
        try {
          const payload = oauth.decodeJWT(idToken)
          if (payload?.email) email = String(payload.email).trim().toLowerCase()
          if (payload?.name) name = String(payload.name).trim()
        } catch {}
      }
    }
  } else if (idToken) {
    try {
      const payload = oauth.decodeJWT(idToken)
      if (payload?.email) email = String(payload.email).trim().toLowerCase()
      if (payload?.name) name = String(payload.name).trim()
    } catch {}
  }

  if (!email) {
    return new Response('Missing email', { status: 400 })
  }

  try {
    const admin = await findAdminByEmail(email)
    let adminId: string

    if (admin) {
      if (!admin.active) {
        return new Response('Account is disabled. Contact admin.', { status: 403 })
      }
      adminId = admin._id
      const { adminsCollection } = await import('@/lib/db')
      await adminsCollection()
        .then((c) => c.updateOne({ _id: admin._id }, { $set: { lastLoginAt: Date.now() } }))
        .catch(() => {})
    } else {
      const createdId = await createAdminFromEmail(email, name || email.split('@')[0])
      adminId = createdId ?? ENV_ADMIN_ID
    }

    const token = createAdminToken(adminId)
    setAdminSessionCookie(adminId)
    void audit(email, 'oauth-login-redirect', 'auth')

    const redirectUrl = new URL('/admin', req.nextUrl)
    const res = NextResponse.redirect(redirectUrl, 302)
    res.cookies.set(ADMIN_COOKIE, token, getAdminCookieOptions())
    return res
  } catch (err: any) {
    console.error('complete-login error:', err)
    return new Response('Login failed', { status: 500 })
  }
}
