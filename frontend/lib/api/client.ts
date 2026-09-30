import { ApiError } from "./errors";

/** Same-origin prefix that `next.config.ts` rewrites to the backend. */
const API_PREFIX = "/api";

/**
 * Browser-side API call. Requests stay on the frontend origin, so the backend's
 * httpOnly cookies are first-party and are sent automatically.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export const jsonBody = (value: unknown): string => JSON.stringify(value);
