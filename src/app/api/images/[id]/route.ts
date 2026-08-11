import { NextRequest } from 'next/server'
import { imagesCollection } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  let oid: ObjectId
  try {
    oid = new ObjectId(ctx.params.id)
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const col = await imagesCollection()
    const doc = await col.findOne({ _id: oid })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    const body = new Uint8Array(doc.data.buffer as ArrayBuffer, doc.data.byteOffset, doc.data.byteLength)
    return new Response(body, {
      headers: {
        'content-type': doc.mime,
        'cache-control': 'public, max-age=86400',
        'content-length': String(doc.size),
      },
    })
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const denied = requireAdmin()
  if (denied) return denied

  try {
    let oid: ObjectId
    try {
      oid = new ObjectId(ctx.params.id)
    } catch {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    const col = await imagesCollection()
    const res = await col.deleteOne({ _id: oid })
    if (res.deletedCount === 0) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}