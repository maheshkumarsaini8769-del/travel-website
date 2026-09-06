import { NextRequest } from 'next/server'
import { getCurrentAdmin, hashPassword, verifyPassword, audit } from '@/lib/auth'
import { adminsCollection } from '@/lib/db'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const currentPassword = String(body?.currentPassword ?? '')
    const newPassword = String(body?.newPassword ?? '')

    if (!newPassword) {
      return Response.json({ error: 'New password is required' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return Response.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
    }

    // For env-based admin
    if (!admin.fromDb) {
      return Response.json({ error: 'Env admin — update ADMIN_PASSWORD in .env.local and restart the server' }, { status: 400 })
    }

    const col = await adminsCollection()
    const doc = await col.findOne({ _id: admin.id })
    if (!doc) return Response.json({ error: 'Admin not found' }, { status: 404 })

    // If admin has a passwordHash, require current password
    if (doc.passwordHash) {
      if (!currentPassword) {
        return Response.json({ error: 'Current password is required' }, { status: 400 })
      }
      if (!verifyPassword(currentPassword, doc.salt, doc.passwordHash)) {
        return Response.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
    }

    // Set new password
    const { salt, hash } = hashPassword(newPassword)
    await col.updateOne({ _id: admin.id }, { $set: { passwordHash: hash, salt, updatedAt: Date.now() } })

    void audit(admin.email, 'change-password', 'auth')

    return Response.json({ ok: true, message: 'Password changed successfully' })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
