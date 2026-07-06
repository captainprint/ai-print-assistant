import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATHS = [
  "/admin/dashboard",
  "/admin/conversations",
  "/admin/settings",
  "/admin/users",
];

const USER_PATHS = ["/user/conversations"];

const LOGIN_PATH = "/u/login";

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

  const isAdminArea = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isUserArea = USER_PATHS.some((p) => pathname.startsWith(p));
  const isLoginPage = pathname === LOGIN_PATH;

  if ((isAdminArea || isUserArea) && !hasToken) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (isAdminArea && role !== "admin") {
    return NextResponse.redirect(new URL("/user/conversations", request.url));
  }

  if (isUserArea && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isLoginPage && hasToken) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/user/conversations", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/u/:path*"],
};
