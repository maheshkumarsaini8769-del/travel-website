import { NextRequest } from 'next/server'
import { POST as leadsPost } from '../leads/route'

// Public alias used by the contact / plan-your-trip forms
export async function POST(req: NextRequest) {
  return leadsPost(req)
}
