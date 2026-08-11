import { clearAdminSessionCookie } from '@/lib/auth'

export async function POST() {
  clearAdminSessionCookie()
  return Response.json({ ok: true })
}