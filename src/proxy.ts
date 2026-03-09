import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  const isProtected = req.nextUrl.pathname.startsWith('/watchlist');

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/watchlist/:path*'],
};
