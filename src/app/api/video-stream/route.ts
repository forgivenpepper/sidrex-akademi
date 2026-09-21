import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return new NextResponse('Missing video URL', { status: 400 });
  }

  try {
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
