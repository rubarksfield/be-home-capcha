import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "behome-admin-session";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin/leads")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const [value, signature] = session.split(".");

  if (!value || !signature) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/leads/:path*"],
};
