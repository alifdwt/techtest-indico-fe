import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const token = request.cookies.get("auth_token")?.value;

  const isProtectedRoute = pathname.startsWith("/vouchers");

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname + request.nextUrl.search);

    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && token) {
    const vouchersUrl = new URL("/vouchers", request.url);
    return NextResponse.redirect(vouchersUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/vouchers/:path*"],
};
