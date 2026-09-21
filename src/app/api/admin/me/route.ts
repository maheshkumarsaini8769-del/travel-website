import { getCurrentAdmin, audit } from '@/lib/auth'

export async function GET(req: Request) {
  const admin = await getCurrentAdmin()
  const { searchParams } = new URL(req.url)
  const isCheck = searchParams.get('check') === '1'

  if (!admin) {
    if (isCheck) {
      return Response.json({ ok: false, authenticated: false }, { status: 200 })
    }
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({
    ok: true,
    authenticated: true,
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

