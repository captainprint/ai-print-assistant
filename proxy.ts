import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/admin/dashboard",
  "/admin/conversations",
  "/admin/settings",
  "/admin/users",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = !!request.cookies.get("admin_token")?.value;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isLoginPage = pathname === "/admin/login";

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && hasToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
