import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  const origin = request.headers.get("origin");

  if (origin && allowedOrigin && origin !== allowedOrigin) {
    return NextResponse.rewrite(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
