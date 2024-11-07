import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "./lib/utils";
export default function middleware(req: NextRequest) {
  if (!apiAuth(req)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted Area"' },
    });
  }
  return withAuth(req);
}

export const config = {
  matcher: [
    "/inbox/:path*",
    "/search/:path*",
    "/settings/:path*",
    "/post/:path*",
    "/api/cron/:path*",
  ],
};
