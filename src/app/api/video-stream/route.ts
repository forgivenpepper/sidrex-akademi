import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return new NextResponse('Missing product ID', { status: 400 });
  }

  let videoUrl: string | null = null;

  try {
    const supabase = await createClient();
    const { data: product, error } = await supabase
      .from('products')
      .select('video_url')
      .eq('id', productId)
      .single();

    if (error || !product || !product.video_url) {
      console.error('Failed to get video URL from DB:', error);
      return new NextResponse('Video not found', { status: 404 });
    }

    videoUrl = product.video_url;

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

    // In Next.js App router, we can return the body stream directly
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error proxying video:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
