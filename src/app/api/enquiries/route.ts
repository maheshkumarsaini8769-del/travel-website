import { NextRequest } from 'next/server'
import { GET as leadsGet, POST as leadsPost } from '../leads/route'

// Public alias used by the contact / plan-your-trip forms
export async function POST(req: NextRequest) {
  return leadsPost(req)
}

export async function GET(req: NextRequest) {
  return leadsGet(req)
}
