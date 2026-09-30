import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { ATTEMPT_TOKEN_COOKIE } from '../http/cookies';

/** The anonymous attempt token from its httpOnly cookie, if any. */
export const AttemptToken = createParamDecorator((_data: unknown, context: ExecutionContext): string | undefined => {
  const request = context.switchToHttp().getRequest<Request>();
  const cookies = request.cookies as Record<string, string> | undefined;
  return cookies?.[ATTEMPT_TOKEN_COOKIE] || undefined;
});
