import { NextRequest, NextResponse } from 'next/server';

const backendOrigin = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:5000';
const internalSecret = process.env.INTERNAL_API_KEY;

function getInternalHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'x-internal-key': internalSecret || '',
  };
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['content-type'] = contentType;
  }
  return headers;
}

/**
 * POST handler: File submission (merge, split, compress, etc.)
 * Backend now returns { jobId } as JSON, so we forward it as JSON.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join('/');
  const backendUrl = `${backendOrigin}/api/pdf/${path}`;

  if (!internalSecret) {
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
  }

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: getInternalHeaders(request),
      body: request.body,
      // @ts-ignore
      duplex: 'half',
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Backend error' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    // If response is JSON (e.g., { jobId } or { count }), forward as JSON
    if (contentType.includes('application/json')) {
      const json = await response.json();
      return NextResponse.json(json, { status: response.status });
    }

    // Otherwise, it's a binary file (e.g., direct /pages response)
    const blob = await response.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Disposition': response.headers.get('Content-Disposition') || '',
      },
    });

  } catch (error: any) {
    console.error(`❌ Proxy POST Error [${path}]:`, error);
    return NextResponse.json({ error: 'Failed to communicate with the PDF engine.' }, { status: 502 });
  }
}

/**
 * GET handler: Job status polling and file download.
 * /api/pdf/status/:jobId  → returns JSON
 * /api/pdf/download/:jobId → returns binary file blob
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join('/');
  const backendUrl = `${backendOrigin}/api/pdf/${path}`;

  if (!internalSecret) {
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
  }

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: { 'x-internal-key': internalSecret },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Backend error' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    // Status endpoint returns JSON
    if (contentType.includes('application/json')) {
      const json = await response.json();
      return NextResponse.json(json, { status: response.status });
    }

    // Download endpoint returns binary
    const blob = await response.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Disposition': response.headers.get('Content-Disposition') || '',
      },
    });

  } catch (error: any) {
    console.error(`❌ Proxy GET Error [${path}]:`, error);
    return NextResponse.json({ error: 'Failed to communicate with the PDF engine.' }, { status: 502 });
  }
}
