import { getCurrentAdmin } from '@/lib/auth'
import { adminsCollection } from '@/lib/db'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let hasPassword = false
  if (admin.fromDb) {
    try {
      const col = await adminsCollection()
      const doc = await col.findOne({ _id: admin.id })
      hasPassword = !!(doc?.passwordHash)
    } catch {
      hasPassword = false
    }
  }

  return Response.json({
    email: admin.email,
    name: admin.name,
    role: admin.role,
    hasPassword,
  })
}
