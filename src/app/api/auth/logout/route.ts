import { NextResponse } from 'next/server'
import { clearAdminSessionCookie, ADMIN_COOKIE } from '@/lib/auth'

export async function POST() {
  clearAdminSessionCookie()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0, httpOnly: true })
  return res
}
