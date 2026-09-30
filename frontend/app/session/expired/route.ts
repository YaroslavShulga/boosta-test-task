import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies";

/**
 * Drops a session cookie the backend rejected (expired or invalid JWT) and sends the
 * user to Sign in. Server Components can't modify cookies, and without this the proxy
 * would bounce between /sign-in and /report while the stale cookie exists.
 */
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  return response;
}
