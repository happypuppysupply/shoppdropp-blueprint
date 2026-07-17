import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Environment variables check
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon || url.includes('placeholder') || anon === 'placeholder') {
    // Skip auth check if env vars aren't set (build time / Vercel preview)
    return res
  }

  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => cookies.forEach((cookie) => req.cookies.set(cookie.name, cookie.value)),
      },
    })
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
  } catch {
    // If auth check fails, just allow through (graceful degradation)
  }

  return res
}

export const config = {
  matcher: ['/app/:path*', '/auth', '/login'],
}