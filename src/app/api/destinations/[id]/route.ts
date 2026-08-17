import { NextRequest } from 'next/server'
import { getDestinationApi, putDestinationApi, deleteDestinationApi } from '@/lib/destinations-api'

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  return getDestinationApi(ctx.params.id)
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  return putDestinationApi(req, ctx.params.id)
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  return deleteDestinationApi(ctx.params.id)
}
