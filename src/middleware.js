import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const publicPaths = ['/login', '/', '/api'];
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith('/api'));

  if (!token && !isPublicPath) {
    // Redirect to login if not authenticated and trying to access a protected route
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (pathname === '/login' || pathname === '/')) {
    // Redirect to dashboard if already authenticated and trying to access login or landing page
    const userCookie = request.cookies.get('user')?.value;
    let redirectPath = '/dashboard';
    
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        switch (user.role) {
          case 'admin': redirectPath = '/dashboard'; break;
          case 'cashier': redirectPath = '/orders'; break;
          case 'kitchen': redirectPath = '/kitchen'; break;
          default: redirectPath = '/dashboard';
        }
      } catch (e) {
        console.error('Failed to parse user cookie in middleware', e);
      }
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files like logos)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
