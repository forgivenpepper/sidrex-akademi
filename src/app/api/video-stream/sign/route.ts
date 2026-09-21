import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Helper to base64url encode a buffer/uint8array
function bufferToBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return new NextResponse('Missing productId', { status: 400 });
  }

  try {
    // 15 minutes expiration
    const exp = Date.now() + 15 * 60 * 1000;
    const payload = JSON.stringify({ p: productId, exp });
    
    // Encode payload to base64url
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(payload);
    const payloadB64 = bufferToBase64Url(payloadBytes);

    // Sign with HMAC SHA-256
    const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-secret';
    const keyData = encoder.encode(secret);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, payloadBytes);
    const sigB64 = bufferToBase64Url(signature);

    const token = `${payloadB64}.${sigB64}`;

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error signing video URL:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
