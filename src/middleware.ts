import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = { matcher: ["/((?!_next|_vercel|api|static|.*\\..*).*)"] };

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const rawHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const override = url.searchParams.get("__host");
  const host = rawHost.includes("localhost") && override ? override : rawHost;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-host", host);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
