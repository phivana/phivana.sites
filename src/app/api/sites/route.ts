// apps/renderer/src/app/api/debug/sites/route.ts
import { NextResponse } from "next/server";
import { listSiteIds, listDomainMap, listSlugMap } from "@/src/lib/sites";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    sites: listSiteIds(),
    domains: listDomainMap(),
    slugs: listSlugMap(),
  });
}
