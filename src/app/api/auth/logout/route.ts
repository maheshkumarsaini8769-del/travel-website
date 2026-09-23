import { NextResponse } from 'next/server'
import { clearAdminSessionCookie, ADMIN_COOKIE } from '@/lib/auth'

export async function POST() {
  clearAdminSessionCookie()
  const res = NextResponse.json({ ok: true })
  const expiredOpts = { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax' as const }
  res.cookies.set(ADMIN_COOKIE, '', expiredOpts)
  res.cookies.set('zenux_access_token', '', expiredOpts)
  res.cookies.set('zenux_id_token', '', expiredOpts)
  res.cookies.set('access_token', '', expiredOpts)
  res.cookies.set('id_token', '', expiredOpts)
  return res
}
