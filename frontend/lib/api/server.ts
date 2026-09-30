import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "./errors";

export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export type ServerResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

/**
 * Server-side API call (Server Components / Route Handlers). It calls the backend
 * directly and forwards the incoming request's cookies, so the backend sees the same
 * session as the browser. Returns a result instead of throwing so callers can
 * `redirect()` outside of try/catch.
 */
export async function serverFetch<T>(path: string): Promise<ServerResult<T>> {
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(`${BACKEND_URL}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
  if (!response.ok) {
    return { ok: false, error: await ApiError.fromResponse(response) };
  }
  return { ok: true, data: (await response.json()) as T };
}
