import { getCurrentAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  return Response.json({
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
}
