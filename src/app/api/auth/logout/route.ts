import { getCurrentAdmin, clearAdminSessionCookie, audit } from '@/lib/auth'

export async function POST() {
  const admin = await getCurrentAdmin()
  if (admin) void audit(admin.username, 'logout', 'auth')
  clearAdminSessionCookie()
  return Response.json({ ok: true })
}
