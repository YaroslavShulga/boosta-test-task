import type { CookieOptions } from 'express';
import type { Environment } from '../../config/environment';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const ATTEMPT_TOKEN_COOKIE = 'attempt_token';

/** Anonymous attempt cookie lifetime: long enough to come back and finish the quiz. */
export const ATTEMPT_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

export function buildCookieOptions(
  environment: Pick<Environment, 'COOKIE_SECURE' | 'COOKIE_SAMESITE' | 'COOKIE_DOMAIN'>,
  maxAgeSeconds?: number
): CookieOptions {
  return {
    httpOnly: true,
    secure: environment.COOKIE_SECURE,
    sameSite: environment.COOKIE_SAMESITE,
    domain: environment.COOKIE_DOMAIN,
    path: '/',
    ...(maxAgeSeconds === undefined ? {} : { maxAge: maxAgeSeconds * 1000 })
  };
}
