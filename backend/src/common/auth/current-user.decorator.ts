import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from './authenticated-request.interface';
import type { AuthenticatedUser } from './authenticated-user.interface';

/** The signed-in user, or `undefined` behind `OptionalJwtAuthGuard` for anonymous requests. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user
);
