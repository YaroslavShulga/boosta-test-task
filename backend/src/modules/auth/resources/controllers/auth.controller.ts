import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AttemptToken } from '../../../../common/auth/attempt-token.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { AuthCookiesService } from '../../../../common/http/auth-cookies.service';
import { AUTH_THROTTLE_LIMIT, AUTH_THROTTLE_TTL_MS } from '../../auth.constants';
import { AuthService } from '../../domain/services/auth.service';
import { SignInRequestPayload } from '../requests/sign-in.request.payload';
import { SignUpRequestPayload } from '../requests/sign-up.request.payload';
import { GetMeResponse } from '../responses/get-me.response';
import { SignInResponse } from '../responses/sign-in.response';
import { SignUpResponse } from '../responses/sign-up.response';

const AUTH_THROTTLE = {
  default: { limit: AUTH_THROTTLE_LIMIT, ttl: AUTH_THROTTLE_TTL_MS }
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookies: AuthCookiesService
  ) {}

  /** Creates the account, signs in and links the quiz just taken (from the attempt cookie). */
  @Post('sign-up')
  @Throttle(AUTH_THROTTLE)
  async signUp(
    @Body() payload: SignUpRequestPayload,
    @AttemptToken() attemptToken: string | undefined,
    @Res({ passthrough: true }) response: Response
  ): Promise<SignUpResponse> {
    const session = await this.authService.signUp(payload.toEntity(), payload.password, attemptToken);
    this.startSession(response, session.accessToken);
    return SignUpResponse.fromEntity(session.user);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async signIn(
    @Body() payload: SignInRequestPayload,
    @AttemptToken() attemptToken: string | undefined,
    @Res({ passthrough: true }) response: Response
  ): Promise<SignInResponse> {
    const session = await this.authService.signIn(payload.toEntity(), payload.password, attemptToken);
    this.startSession(response, session.accessToken);
    return SignInResponse.fromEntity(session.user);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@Res({ passthrough: true }) response: Response): void {
    this.authCookies.clearAccessToken(response);
    this.authCookies.clearAttemptToken(response);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: AuthenticatedUser): Promise<GetMeResponse> {
    return GetMeResponse.fromResult(await this.authService.getProfile(user.id));
  }

  private startSession(response: Response, accessToken: string): void {
    this.authCookies.setAccessToken(response, accessToken);
    // The anonymous attempts now belong to the user.
    this.authCookies.clearAttemptToken(response);
  }
}
