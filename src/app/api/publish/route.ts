import { NextRequest, NextResponse } from "next/server";
import { putSite, mapHostToSite, mapSlugToSite, getSiteBySlug } from "@/src/lib/sites";

export const runtime = "nodejs";

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
  const { siteId, site, eventId, domains, slug: passedSlug } = body || {};
  if (!siteId || !site) {
    return NextResponse.json({ ok: false, code: "INVALID_BODY" }, { status: 400 });
  }

  // Inject eventId if provided (RSVP block expects it)
  if (eventId && !site.eventId) site.eventId = eventId;

  const PREVIEW_ROOT = (process.env.RENDERER_PREVIEW_ROOT ?? "phivana.sites").trim();
  const PUBLIC_ORIGIN = (process.env.RENDERER_PUBLIC_ORIGIN ?? req.nextUrl.origin).replace(/\/+$/, "");

  // 1) Derive a stable slug
  let slug: string | undefined = passedSlug || site?.meta?.slug;
  if (!slug) {
    const base =
      slugify(site?.meta?.title) ||
      slugify(site?.pages?.[0]?.name) ||
      "mysite";
    slug = `${base}-${token(5)}`;
    site.meta = { ...(site.meta ?? {}), slug };
  }

  // guarantee uniqueness (in-memory scope) if re-used accidentally
  const existing = getSiteBySlug(slug);
  if (existing && existing !== site) {
    slug = `${slug}-${token(3)}`;
    site.meta.slug = slug;
  }

  // 2) Construct preview host and map it
  const previewHost = `${slug}.${PREVIEW_ROOT}`;
  mapHostToSite(previewHost, siteId);
  mapSlugToSite(slug, siteId);

  // 3) Store snapshot
  putSite(siteId, site);

  // 4) Optional: also map explicit domains passed by API (primary, aliases…)
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

  // Dev convenience: URL that forces host using your middleware (?__host=…)
  const previewUrl = `${PUBLIC_ORIGIN}/?__host=${encodeURIComponent(previewHost)}`;

  const pageCount = Array.isArray(site?.pages) ? site.pages.length : 0;
  console.log(
    `[renderer] Stored siteId=${siteId} (pages=${pageCount}, slug=${slug}, host=${previewHost})`
  );

  return NextResponse.json({
    ok: true,
    // internal /s route remains available
    url: `/s/${siteId}`,
    // new: slug + preview host + a dev-friendly URL
    slug,
    previewHost,
    previewUrl,
  });
}
