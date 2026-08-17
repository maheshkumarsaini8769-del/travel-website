import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { imagesCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function GET(): Promise<Response> {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const col = await imagesCollection()
    const docs = await col.find().sort({ _id: -1 }).toArray()
    return Response.json(
      docs.map((d) => ({
        id: String(d._id),
        mime: d.mime,
        size: d.size,
        name: d.name,
        url: `/api/images/${String(d._id)}`,
      }))
    )
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const body = (await req.json()) as { data?: string; name?: string }
    const dataUrl = String(body.data ?? '')
    const match = /^data:([\w./+-]+);base64,([\s\S]+)$/.exec(dataUrl)
    if (!match) return Response.json({ error: 'Invalid image data (expected a base64 data URL)' }, { status: 400 })

    const mime = match[1]
    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.length === 0 || buffer.length > 8 * 1024 * 1024) {
      return Response.json({ error: 'Image must be between 1 byte and 8 MB' }, { status: 400 })
    }

    const col = await imagesCollection()
    const res = await col.insertOne({
      _id: new ObjectId(),
      mime,
      size: buffer.length,
      data: buffer,
      name: String(body.name ?? 'upload.png'),
    })
    return Response.json({ ok: true, id: String(res.insertedId) }, { status: 201 })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}