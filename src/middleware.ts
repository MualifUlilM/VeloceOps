import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Whitelist public assets, api, landing, pricing, portal, and login
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/project') ||
    pathname === '/login' ||
    pathname === '/landing' ||
    pathname === '/pricing' ||
    pathname.startsWith('/portal') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Check for auth session cookie
  const authSession = request.cookies.get('veloce_auth_session');

  // If no auth cookie found, redirect directly to /login
  if (!authSession || !authSession.value) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
