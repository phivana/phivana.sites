import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * We can’t query Mongo in middleware (Edge), so just forward the effective host
 * into a request header the page can read and resolve to a siteId.
 */
export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  const incomingHost =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "";

  // Dev helper: allow ?__host=slug.phivana.site when running on localhost
  const devHost = url.searchParams.get("__host");
  const effectiveHost =
    incomingHost.includes("localhost") && devHost ? devHost : incomingHost;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-host", effectiveHost);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// Apply to all non-static paths (skip _next, api, assets, etc.)
export const config = {
  matcher: ["/((?!_next|_vercel|api|static|.*\\..*).*)"],
};
