import { NextRequest } from 'next/server'
import { getCurrentAdmin, requireAdmin, hashPassword, verifyPassword, audit } from '@/lib/auth'
import { adminsCollection } from '@/lib/db'

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const admin = await getCurrentAdmin()
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const oldPassword = String(body?.oldPassword ?? '')
    const newPassword = String(body?.newPassword ?? '')

    if (newPassword.length < 8) {
      return Response.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    if (admin.fromDb) {
      const col = await adminsCollection()
      const doc = await col.findOne({ _id: admin.id })
      if (!doc || !verifyPassword(oldPassword, doc.salt, doc.passwordHash)) {
        return Response.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
      const { salt, hash } = hashPassword(newPassword)
      await col.updateOne({ _id: admin.id }, { $set: { passwordHash: hash, salt } })
      void audit(admin.username, 'password.changed', 'auth', admin.id)
      return Response.json({ ok: true })
    }

    return Response.json(
      { error: 'Database not connected. Password change requires the database.' },
      { status: 503 }
    )
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
