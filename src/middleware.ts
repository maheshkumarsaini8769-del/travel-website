import { NextRequest, NextResponse } from 'next/server'

const CANONICAL_HOST = 'www.sunskytourism.in'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()
  const isLocal = host === 'localhost' || host.endsWith('.local')

  const target = request.nextUrl.clone()
  if (!isLocal && host !== CANONICAL_HOST) {
    target.protocol = 'https:'
    target.host = CANONICAL_HOST
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    target.pathname = pathname.replace(/\/+$/, '')
  }

  const needsRedirect =
    target.host !== request.nextUrl.host ||
    target.protocol !== request.nextUrl.protocol ||
    target.pathname !== pathname

  if (needsRedirect) return NextResponse.redirect(target, 301)

  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  return response
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}