import { apiFetch, jsonBody } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import type { AuthUser, Me } from "@/lib/api/types";

export interface Credentials {
  email: string;
  password: string;
}

// Both calls also link the browser's anonymous quiz attempts to the account (backend side).
export const signUp = (credentials: Credentials) =>
  apiFetch<AuthUser>("/auth/sign-up", { method: "POST", body: jsonBody(credentials) });

export const signIn = (credentials: Credentials) =>
  apiFetch<AuthUser>("/auth/sign-in", { method: "POST", body: jsonBody(credentials) });

export const signOut = () => apiFetch<void>("/auth/sign-out", { method: "POST" });

/** The signed-in user, or `null` for an anonymous visitor. */
export async function getMe(): Promise<Me | null> {
  try {
    return await apiFetch<Me>("/auth/me");
  } catch (error) {
    if (isApiError(error) && error.statusCode === 401) {
      return null;
    }
    throw error;
  }
}
