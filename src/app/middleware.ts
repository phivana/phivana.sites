
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "unknown-host";
  // Attach host to request so pages can read it (for now, just demo)
  const res = NextResponse.next();
  res.headers.set("x-request-host", host);
  return res;
}

// Apply to all pages
export const config = {
  matcher: ["/:path*"],
};

