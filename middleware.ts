import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Define protected paths
  const protectedPaths = ['/dashboard', '/post-job'];
  const { pathname } = req.nextUrl;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const res = NextResponse.next();
    
    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => req.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove: (name, options) => {
            res.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Check if we have a session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/post-job/:path*'],
}; 