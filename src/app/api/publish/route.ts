// apps/renderer/src/app/api/publish/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  putSite,
  mapHostToSite,
  mapSlugToSite,
  getSiteIdBySlug, // ⬅️ use siteId for dedupe, not object identity
} from "@/src/lib/sites";

export const runtime = "nodejs";

// normalize a string into a safe base for the slug
function slugify(s?: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 32);
}

function token(n = 5) {
  return Math.random().toString(36).slice(2, 2 + n);
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  const expect = process.env.RENDERER_API_KEY ?? "";
  if (expect && key !== expect) {
    return NextResponse.json({ ok: false, code: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    siteId,
    site,
    eventId,
    domains,
    // optional direct pass-through (kept for compatibility)
    slug: passedSlug,
  } = body || {};

  if (!siteId || !site) {
    return NextResponse.json({ ok: false, code: "INVALID_BODY" }, { status: 400 });
  }

  // Ensure the site carries eventId (RSVP etc.)
  if (eventId && !site.eventId) site.eventId = eventId;

  const PREVIEW_ROOT = (process.env.RENDERER_PREVIEW_ROOT ?? "phivana.sites").trim();
  const PUBLIC_ORIGIN = (process.env.RENDERER_PUBLIC_ORIGIN ?? req.nextUrl.origin).replace(/\/+$/, "");

  // ──────────────────────────────────────────────────────────────────────────
  // 1) Resolve a *stable* preview slug
  //    Priority:
  //      (a) passedSlug (explicit)  → used as-is
  //      (b) site.meta.previewSlug  → persistently stored slug from DB
  //      (c) fallback: derived from title/page name + random token
  // ──────────────────────────────────────────────────────────────────────────
  let slug: string | undefined =
    passedSlug || site?.meta?.previewSlug || site?.meta?.slug; // support older "slug" if present

  // derive a new slug only when none exists
  let baseForNewSlug = "";
  if (!slug) {
    baseForNewSlug =
      slugify(site?.meta?.title) ||
      slugify(site?.pages?.[0]?.name) ||
      "mysite";
    slug = `${baseForNewSlug}-${token(5)}`;
    site.meta = { ...(site.meta ?? {}), previewSlug: slug };
  }

  // If slug collides with a different siteId, make it unique (idempotent by siteId).
  // Use a loop in the unlikely case of repeated collisions.
  const ensureUniqueSlug = (initial: string) => {
    let s = initial;
    let mapped = getSiteIdBySlug(s);
    // generate base (just once) if we didn't earlier
    if (!baseForNewSlug) {
      baseForNewSlug = s.replace(/-[a-z0-9]+$/, "") || s;
    }
    while (mapped && mapped !== siteId) {
      s = `${baseForNewSlug}-${token(3)}`;
      mapped = getSiteIdBySlug(s);
    }
    return s;
  };

  slug = ensureUniqueSlug(slug);

  // record back to the site meta (so your DB snapshot can persist it)
  site.meta = {
    ...(site.meta ?? {}),
    previewSlug: slug,
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 2) Construct preview host and map it
  // ──────────────────────────────────────────────────────────────────────────
  const previewHost = `${slug}.${PREVIEW_ROOT}`;
  mapHostToSite(previewHost, siteId);
  mapSlugToSite(slug, siteId);

  // Also store a convenience field (optional) so you can read it in the preview UI
  site.meta.previewDomain = previewHost;

  // 3) Store snapshot
  putSite(siteId, site);

  // 4) Optional: map explicit domains (primary, aliases)
  if (domains && typeof domains === "object") {
    const { preview, primary, aliases } = domains as {
      preview?: string;
      primary?: string;
      aliases?: string[];
    };
    [preview, primary, ...(aliases ?? [])]
      .filter(Boolean)
      .forEach((h) => mapHostToSite(String(h), siteId));
  }

  // Dev convenience: a URL that forces host via middleware (?__host=…)
  const previewUrl = `${PUBLIC_ORIGIN}/?__host=${encodeURIComponent(previewHost)}`;

  const pageCount = Array.isArray(site?.pages) ? site.pages.length : 0;
  console.log(
    `[renderer] Stored siteId=${siteId} (pages=${pageCount}, slug=${slug}, host=${previewHost})`
  );

  return NextResponse.json({
    ok: true,
    url: `/s/${siteId}`,      // internal (ID-based) preview
    slug,                     // stable slug (now in site.meta.previewSlug)
    previewHost,              // e.g. "annaandben-zu98h.phivana.sites"
    previewUrl,               // dev helper: http://localhost:3002/?__host=… 
  });
}
