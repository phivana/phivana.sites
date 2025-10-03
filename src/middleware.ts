import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Match everything except next internals and api */
export const config = { matcher: ["/((?!_next|_vercel|api|static|.*\\..*).*)"] };

const PREVIEW_ROOT = process.env.RENDERER_PREVIEW_ROOT || "phivana.sites";
/**
 * Optional dev alt root (lets you open `slug.localhost:3002`).
 * If set, middleware rewrites `x-request-host` to `<slug>.<PREVIEW_ROOT>`.
 */
const DEV_ALT_ROOT = process.env.RENDERER_DEV_ALT_ROOT || "";

/** Normalize the host we forward to the app (x-request-host). */
function normalizeHost(rawHost: string, url: URL): string {
  // Dev override: ?__host=<host>
  const override = url.searchParams.get("__host");
  if (override) return override;

  // If you use `slug.localhost`, rewrite to `slug.<PREVIEW_ROOT>`
  if (DEV_ALT_ROOT && rawHost.endsWith(`.${DEV_ALT_ROOT}`)) {
    const sub = rawHost.slice(0, -1 * (`.${DEV_ALT_ROOT}`.length));
    if (sub) return `${sub}.${PREVIEW_ROOT}`;
  }

  return rawHost;
}

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  const rawHost =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "";

  // In dev, respecting ?__host= and slug.localhost
  const host = normalizeHost(rawHost.split(",")[0].trim().replace(/:\d+$/, ""), url);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-host", host);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
