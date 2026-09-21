import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Missing token', { status: 401 });
  }

  let videoUrl: string;
  let productId: string;

  try {
    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) throw new Error('Invalid token format');

    const encoder = new TextEncoder();
    const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-secret';
    const keyData = encoder.encode(secret);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBuffer = base64UrlToBuffer(sigB64);
    const payloadBuffer = encoder.encode(payloadB64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      signatureBuffer,
      payloadBuffer
    );

    if (!isValid) {
      return new NextResponse('Invalid token signature', { status: 403 });
    }

    const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadStr);

    if (Date.now() > payload.exp) {
      return new NextResponse('Token expired', { status: 403 });
    }

    productId = payload.p;

    if (productId === 'DEMO') {
      videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
    } else {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      const res = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${productId}&select=video_url`, {
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey!}`
        }
      });
      const data = await res.json();
      
      if (!data || data.length === 0 || !data[0].video_url) {
        return new NextResponse('Video not found', { status: 404 });
      }

      videoUrl = data[0].video_url;
    }

    // Determine headers to forward (specifically Range for seeking)
    const rangeHeader = req.headers.get('range');
    const headersToForward: HeadersInit = {};
    if (rangeHeader) {
      headersToForward['Range'] = rangeHeader;
    }

    // Fetch the video from the external source
    const response = await fetch(videoUrl, {
      headers: headersToForward,
    });

    if (!response.ok) {
      console.error(`Failed to fetch video: ${response.statusText}`);
      return new NextResponse('Error fetching video', { status: response.status });
    }

    // Forward the response headers (like content-type, content-length, content-range)
    const responseHeaders = new Headers();
    const headersToKeep = [
      'content-type',
      'content-length',
      'accept-ranges',
      'content-range',
      'cache-control',
    ];

    for (const [key, value] of response.headers.entries()) {
      if (headersToKeep.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    }

    // Return standard Response for native Edge streaming performance
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error proxying video:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
