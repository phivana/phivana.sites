import { NextRequest, NextResponse } from "next/server";
import { putSite } from "@/src/lib/sites";

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  const expect = process.env.RENDERER_API_KEY ?? "";
  if (expect && key !== expect) {
    return NextResponse.json({ ok: false, code: "FORBIDDEN" }, { status: 403 });
  }

  const { siteId, site } = await req.json().catch(() => ({} as any));
  if (!siteId || !site) return NextResponse.json({ ok: false, code: "INVALID_BODY" }, { status: 400 });

  putSite(siteId, site);
  return NextResponse.json({ ok: true, url: `/s/${siteId}` });
}
