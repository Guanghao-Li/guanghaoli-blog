import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin-auth";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminPassword = getAdminPassword();

  // 登录页面和登录 API 必须放行，不能要求 cookie
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    if (pathname === "/admin/login") {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      if (token && adminPassword && token === adminPassword) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!adminPassword) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (token !== adminPassword) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
