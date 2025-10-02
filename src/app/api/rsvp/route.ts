// apps/renderer/src/app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_ORIGIN =
  process.env.API_ORIGIN || process.env.NEXT_PUBLIC_API_ORIGIN || '';

export async function POST(req: NextRequest) {
  if (!API_ORIGIN) {
    return NextResponse.json(
      { ok: false, error: 'API_ORIGIN not configured on renderer.' },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(`${API_ORIGIN}/api/rsvp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Upstream RSVP API unavailable.' },
      { status: 502 }
    );
  }
}
