import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getSettings, saveSetting, defaultSettings } from '@/lib/settings'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const settings = await getSettings()
  if (key && key in settings) {
    return Response.json((settings as unknown as Record<string, unknown>)[key], { headers: { 'cache-control': 'no-store' } })
  }
  return Response.json(settings, { headers: { 'cache-control': 'no-store' } })
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin('cms.edit')
  if (denied) return denied

  try {
    const body = await req.json()
    const key = String(body?.key ?? '')
    if (!key || !(key in defaultSettings)) {
      return Response.json({ error: 'Invalid settings key' }, { status: 400 })
    }
    if (body?.value === undefined || typeof body.value !== 'object' || body.value === null) {
      return Response.json({ error: 'Value must be an object' }, { status: 400 })
    }
    await saveSetting(key, body.value)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 })
  }
}
