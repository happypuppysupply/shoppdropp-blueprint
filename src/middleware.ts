import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Auth pages - redirect to app if already logged in
  if (req.nextUrl.pathname === '/auth' || req.nextUrl.pathname === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/app', req.url))
    }
    return res
  }

  // Protected routes - redirect to auth if not logged in
  if (req.nextUrl.pathname.startsWith('/app')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/app/:path*', '/auth', '/login'],
}
