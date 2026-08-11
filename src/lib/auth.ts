import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE = 'admin_session'
const SESSION_DAYS = 7

function sign(value: string): string {
  return createHmac('sha256', process.env.ADMIN_SECRET ?? 'sunsky-dev-secret')
    .update(value)
    .digest('hex')
}

export function createAdminToken(): string {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * SESSION_DAYS
  const payload = `${expiry}.${process.env.ADMIN_PASSWORD ?? ''}`
  return `${expiry}.${sign(payload)}`
}

export function isAdminAuthed(): boolean {
  const token = cookies().get(ADMIN_COOKIE)?.value
  if (!token) return false
  const [expiry, mac] = token.split('.')
  if (!expiry || !mac) return false
  const exp = Number(expiry)
  if (!Number.isFinite(exp) || exp < Date.now()) return false
  const expected = sign(`${expiry}.${process.env.ADMIN_PASSWORD ?? ''}`)
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function requireAdmin(): Response | null {
  if (!isAdminAuthed()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export function setAdminSessionCookie(): void {
  cookies().set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: '/',
  })
}

export function clearAdminSessionCookie(): void {
  cookies().set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 0, path: '/' })
}