import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin-session')
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
