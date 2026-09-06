import { NextRequest, NextResponse } from 'next/server'

const CANONICAL_HOST = 'www.sunskytourism.in'
const ALLOWED_HOSTS = [
  'travel-website-livid-three.vercel.app',
  'travel-website-lhhmxvdex-maheshkumarsaini8769-dels-projects.vercel.app',
  'travel-website-5x88w848t-maheshkumarsaini8769-dels-projects.vercel.app',
  'localhost',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()
  const isLocal = host === 'localhost' || host.endsWith('.local')
  const isAllowed = ALLOWED_HOSTS.some((h) => host === h || host.endsWith('.' + h))

  const target = request.nextUrl.clone()
  if (!isLocal && !isAllowed && host !== CANONICAL_HOST) {
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

  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  } else {
    response.headers.set('Cache-Control', 'public, s-maxage=300, max-age=60, stale-while-revalidate=600')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
