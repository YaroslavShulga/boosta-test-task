import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies";

/**
 * Optimistic route guard based only on the presence of the session cookie.
 * The backend stays the source of truth: the report page handles a 401 itself.
 */
export function proxy(request: NextRequest) {
  const signedIn = request.cookies.has(ACCESS_TOKEN_COOKIE);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/report") && !signedIn) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if ((pathname === "/sign-in" || pathname === "/sign-up") && signedIn) {
    return NextResponse.redirect(new URL("/report", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/report/:path*", "/sign-in", "/sign-up"],
};
