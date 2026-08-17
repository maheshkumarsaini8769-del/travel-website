import { getCurrentAdmin, audit } from '@/lib/auth'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  return Response.json({
    ok: true,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      fromDb: admin.fromDb,
    },
  })
}
