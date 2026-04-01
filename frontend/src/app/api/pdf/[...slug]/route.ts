import { NextRequest, NextResponse } from 'next/server';

/**
 * PDF API Proxy Handler.
 * Effectively acts as a secure bridge between the browser and the internal PDF engine.
 * Only reachable because this runs on your Server-Side.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const { slug } = await params;
  const path = slug.join('/');
  
  // Use the internal URL from environment, or fallback to localhost
  const backendOrigin = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:5000';
  const backendUrl = `${backendOrigin}/api/pdf/${path}`;
  const internalSecret = process.env.INTERNAL_API_KEY;

  if (!internalSecret) {
    console.error('❌ INTERNAL_API_KEY not found in environment variables.');
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
  }

  try {
    // Re-dispatch the request to the backend with the secret key injected
    // Pass the body stream directly to the backend fetch call
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'x-internal-key': internalSecret,
        // Forward content-type for multipart/form-data (contains the boundary)
        'content-type': request.headers.get('content-type') || 'application/octet-stream',
      },
      // Directly stream the original request body from the client to the backend
      // without buffering it in the Next.js server's memory first.
      body: request.body,
      // @ts-ignore - 'duplex' is required when passing a stream to fetch
      duplex: 'half',
      cache: 'no-store',
    });

    // Check if the backend responded with an error
    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: 'Backend error' }));
       return NextResponse.json(errorData, { status: response.status });
    }

    // Stream the binary response back to the client
    const responseData = await response.blob();
    return new NextResponse(responseData, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/pdf',
        'Content-Disposition': response.headers.get('Content-Disposition') || '',
      },
    });

  } catch (error: any) {
    console.error(`❌ Proxy Error [${path}]:`, error);
    return NextResponse.json(
      { error: 'Failed to communicate with the PDF engine.' }, 
      { status: 502 }
    );
  }
}
