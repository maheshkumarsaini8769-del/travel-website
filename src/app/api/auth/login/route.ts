import { NextRequest } from 'next/server'
import { setAdminSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const password = String(body?.password ?? '')
    const expected = process.env.ADMIN_PASSWORD ?? ''
    if (!expected || password !== expected) {
      return Response.json({ error: 'Invalid password' }, { status: 401 })
    }
    setAdminSessionCookie()
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}