import type { ApiErrorBody } from "./types";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** A failed API call, carrying the backend's `{ statusCode, code, message }` error shape. */
export class ApiError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let body: ApiErrorBody | null = null;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // Non-JSON error (e.g. the backend is down and the proxy returned HTML).
    }
    const message = Array.isArray(body?.message) ? body.message.join(" ") : body?.message;
    return new ApiError(
      response.status,
      body?.code ?? (response.status === 429 ? "TOO_MANY_REQUESTS" : "UNKNOWN"),
      response.status === 429 ? "Too many attempts. Please wait a minute and try again." : (message ?? FALLBACK_MESSAGE),
    );
  }
}

export function isApiError(error: unknown, code?: string): error is ApiError {
  return error instanceof ApiError && (code === undefined || error.code === code);
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : FALLBACK_MESSAGE;
}
