import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppException } from '../errors/app.exception';
import { ErrorCode } from '../errors/error-code';
import { ACCESS_TOKEN_COOKIE } from '../http/cookies';
import type { AuthenticatedRequest } from './authenticated-request.interface';
import type { AuthenticatedUser } from './authenticated-user.interface';
import type { JwtPayload } from './jwt-payload.interface';

/** Requires a valid access token cookie and attaches `request.user`. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(protected readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.resolveUser(request);
    if (!user) {
      throw new AppException(HttpStatus.UNAUTHORIZED, ErrorCode.Unauthorized, 'Please sign in to continue.');
    }
    request.user = user;
    return true;
  }

  protected async resolveUser(request: AuthenticatedRequest): Promise<AuthenticatedUser | null> {
    const cookies = request.cookies as Record<string, string> | undefined;
    const token = cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) {
      return null;
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return { id: payload.sub };
    } catch {
      return null;
    }
  }
}
