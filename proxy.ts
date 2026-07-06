import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/admin/dashboard",
  "/admin/conversations",
  "/admin/settings",
  "/admin/users",
];

const ADMIN_ONLY_PATHS = ["/admin/dashboard", "/admin/settings", "/admin/users"];

function getRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)).role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  const hasToken = !!token;
  const role = token ? getRole(token) : null;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAdminOnly = ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p));
  const isLoginPage = pathname === "/admin/login";

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminOnly && hasToken && role !== "admin") {
    return NextResponse.redirect(new URL("/admin/conversations", request.url));
  }

  if (isLoginPage && hasToken) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/admin/conversations", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
