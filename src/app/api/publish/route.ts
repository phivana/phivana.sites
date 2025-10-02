// apps/renderer/src/app/api/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { putSite, mapHostToSite } from '@/src/lib/sites';

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-api-key');
  const expect = process.env.RENDERER_API_KEY ?? '';
  if (expect && key !== expect) {
    return NextResponse.json({ ok: false, code: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { siteId, site, eventId, domains } = body || {};

  if (!siteId || !site) {
    return NextResponse.json({ ok: false, code: 'INVALID_BODY' }, { status: 400 });
  }

  // Ensure the site carries eventId (SectionRSVP needs it)
  if (eventId && !site.eventId) site.eventId = eventId;

  putSite(siteId, site);

  // Optional domain mapping (so [[...slug]] route can resolve by host)
  if (domains && typeof domains === 'object') {
    const { preview, primary, aliases } = domains as {
      preview?: string;
      primary?: string;
      aliases?: string[];
    };
    [preview, primary, ...(aliases ?? [])]
      .filter(Boolean)
      .forEach((h) => mapHostToSite(String(h), siteId));
  }

  return NextResponse.json({ ok: true, url: `/s/${siteId}` });
}
