import { isAdminAuthed } from '@/lib/auth'

export async function GET() {
  if (!isAdminAuthed()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json({ ok: true })
}