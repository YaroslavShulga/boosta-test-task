import { ExecutionContext, Injectable } from '@nestjs/common';
import type { AuthenticatedRequest } from './authenticated-request.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

/** Attaches `request.user` when a valid access token is present; never rejects. */
@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.user = (await this.resolveUser(request)) ?? undefined;
    return true;
  }
}
