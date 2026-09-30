import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { Environment } from '../../config/environment';
import { ACCESS_TOKEN_COOKIE, ATTEMPT_TOKEN_COOKIE, ATTEMPT_TOKEN_TTL_SECONDS, buildCookieOptions } from './cookies';

/** Sets and clears the httpOnly cookies used for authentication and anonymous attempts. */
@Injectable()
export class AuthCookiesService {
  constructor(private readonly config: ConfigService<Environment, true>) {}

  setAccessToken(response: Response, token: string): void {
    response.cookie(ACCESS_TOKEN_COOKIE, token, this.options(this.config.get('JWT_TTL', { infer: true })));
  }

  clearAccessToken(response: Response): void {
    response.clearCookie(ACCESS_TOKEN_COOKIE, this.options());
  }

  setAttemptToken(response: Response, token: string): void {
    response.cookie(ATTEMPT_TOKEN_COOKIE, token, this.options(ATTEMPT_TOKEN_TTL_SECONDS));
  }

  clearAttemptToken(response: Response): void {
    response.clearCookie(ATTEMPT_TOKEN_COOKIE, this.options());
  }

  private options(maxAgeSeconds?: number) {
    return buildCookieOptions(
      {
        COOKIE_SECURE: this.config.get('COOKIE_SECURE', { infer: true }),
        COOKIE_SAMESITE: this.config.get('COOKIE_SAMESITE', { infer: true }),
        COOKIE_DOMAIN: this.config.get('COOKIE_DOMAIN', { infer: true })
      },
      maxAgeSeconds
    );
  }
}
