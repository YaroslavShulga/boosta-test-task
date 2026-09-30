export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** Stricter rate limit for credential endpoints: requests per minute per client. */
export const AUTH_THROTTLE_LIMIT = 10;
export const AUTH_THROTTLE_TTL_MS = 60_000;
