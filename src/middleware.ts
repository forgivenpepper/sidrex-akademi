import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Helper to base64url decode
function base64UrlToBuffer(b64url: string) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const binStr = atob(b64);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const pathname = request.nextUrl.pathname;

  // 1. Extreme Speed Native Proxy (Middleware Rewrite)
  if (pathname.startsWith('/api/secure-media')) {
    const token = request.nextUrl.searchParams.get('token');
    if (!token) return new NextResponse('Missing token', { status: 401 });

    try {
      const [payloadB64, sigB64] = token.split('.');
      if (!payloadB64 || !sigB64) throw new Error('Invalid token');

      const encoder = new TextEncoder();
      const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-secret';
      const keyData = encoder.encode(secret);
      const cryptoKey = await crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
      );

      const isValid = await crypto.subtle.verify(
        'HMAC', cryptoKey, base64UrlToBuffer(sigB64), encoder.encode(payloadB64)
      );

      if (!isValid) return new NextResponse('Forbidden', { status: 403 });

      const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr);

      if (Date.now() > payload.exp) return new NextResponse('Expired', { status: 403 });

      const productId = payload.p;
      
      let videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
      
      if (productId !== 'DEMO') {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const res = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}&select=video_url`, {
          headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey!}` },
          cache: 'no-store'
        });
        const data = await res.json();
        if (data && data.length > 0 && data[0].video_url) {
          videoUrl = data[0].video_url.trim();
        } else {
          return new NextResponse('Not found', { status: 404 });
        }
      }

      // If Google Drive link, convert to /preview for Edge rewrite
      if (videoUrl.includes('drive.google.com')) {
        const gDriveMatch = videoUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || videoUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (gDriveMatch && gDriveMatch[1]) {
          videoUrl = `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`;
        }
      }

      // MUST use new URL() for external rewrites to work properly in Vercel Edge!
      return NextResponse.rewrite(new URL(videoUrl));
    } catch (e) {
      console.error(e);
      return new NextResponse('Proxy Error', { status: 500 });
    }
  }

  // 2. Standard Supabase Auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // If user is not logged in and not on auth page, redirect to login
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access auth page, redirect to home
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Check admin route access
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
