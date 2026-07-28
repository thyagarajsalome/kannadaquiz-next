import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return new NextResponse(JSON.stringify([{ fraction: 1.0 }]), {
    status: 200,
    headers: {
      'Content-Type': 'application/trafficadvice+json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}