import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect all /admin/* routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for session cookie named 'admin-session'
    const sessionCookie = request.cookies.get('admin-session')
    if (!sessionCookie || !sessionCookie.value) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}