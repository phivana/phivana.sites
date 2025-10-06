import { NextRequest, NextResponse } from "next/server";
import { putSite } from "@/src/lib/sites";
import type { StoredSite } from "@/src/lib/sites";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImportPayload = {
  siteId: string;
  site: unknown;
};

// Minimal runtime check; if you have a real runtime schema, use it here.
function isStoredSite(v: unknown): v is StoredSite {
  return typeof v === "object" && v !== null;
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  const expect = process.env.RENDERER_API_KEY ?? "";
  if (expect && key !== expect) {
    return NextResponse.json({ ok: false, code: "FORBIDDEN" }, { status: 403 });
  }

  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 });
  }

  if (!bodyUnknown || typeof bodyUnknown !== "object") {
    return NextResponse.json({ ok: false, code: "INVALID_BODY" }, { status: 400 });
  }
  const body = bodyUnknown as Record<string, unknown>;

  const siteId = typeof body.siteId === "string" ? body.siteId : undefined;
  const site = body.site;

  if (!siteId || !isStoredSite(site)) {
    return NextResponse.json({ ok: false, code: "INVALID_BODY" }, { status: 400 });
  }

  putSite(siteId, site); // ✅ site is now StoredSite
  return NextResponse.json({ ok: true, url: `/s/${siteId}` });
}
