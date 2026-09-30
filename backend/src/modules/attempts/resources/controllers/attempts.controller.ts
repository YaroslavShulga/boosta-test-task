import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Res,
  UseGuards
} from '@nestjs/common';
import type { Response } from 'express';
import { AttemptToken } from '../../../../common/auth/attempt-token.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../../../common/auth/optional-jwt-auth.guard';
import { AuthCookiesService } from '../../../../common/http/auth-cookies.service';
import type { AttemptOwner } from '../../domain/interfaces/attempt-owner.interface';
import { AttemptsService } from '../../domain/services/attempts.service';
import { SaveAnswerRequestPayload } from '../requests/save-answer.request.payload';
import { StartAttemptRequestPayload } from '../requests/start-attempt.request.payload';
import { AttemptProgressResponse } from '../responses/attempt-progress.response';
import { CompleteAttemptResponse } from '../responses/complete-attempt.response';
import { GetAttemptsResponse } from '../responses/get-attempts.response';

/**
 * Quiz attempts. Works for anonymous visitors (identified by the httpOnly
 * attempt cookie) and for signed-in users (identified by the access token).
 */
@Controller('attempts')
@UseGuards(OptionalJwtAuthGuard)
export class AttemptsController {
  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly authCookies: AuthCookiesService
  ) {}

  /** Starts a new attempt; an unfinished one is marked abandoned. */
  @Post()
  async start(
    @Body() payload: StartAttemptRequestPayload,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @AttemptToken() attemptToken: string | undefined,
    @Res({ passthrough: true }) response: Response
  ): Promise<AttemptProgressResponse> {
    const started = await this.attemptsService.start(
      AttemptsController.toOwner(user, attemptToken),
      payload.toEntity()
    );
    if (started.anonymousToken) {
      this.authCookies.setAttemptToken(response, started.anonymousToken);
    }
    return AttemptProgressResponse.fromResult(started.progress);
  }

  /** The owner's unfinished attempt, to offer "Continue where you left off". */
  @Get('in-progress')
  async getInProgress(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @AttemptToken() attemptToken: string | undefined
  ): Promise<AttemptProgressResponse> {
    return AttemptProgressResponse.fromResult(
      await this.attemptsService.getInProgress(AttemptsController.toOwner(user, attemptToken))
    );
  }

  /** Saves or changes the answer to one question. */
  @Put(':attemptId/answers/:questionId')
  async saveAnswer(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() payload: SaveAnswerRequestPayload,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @AttemptToken() attemptToken: string | undefined
  ): Promise<AttemptProgressResponse> {
    return AttemptProgressResponse.fromResult(
      await this.attemptsService.saveAnswer(
        AttemptsController.toOwner(user, attemptToken),
        payload.toEntity(attemptId, questionId)
      )
    );
  }

  /** Finishes the attempt and calculates the result. */
  @Post(':attemptId/complete')
  @HttpCode(HttpStatus.OK)
  async complete(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @AttemptToken() attemptToken: string | undefined
  ): Promise<CompleteAttemptResponse> {
    return CompleteAttemptResponse.fromEntity(
      await this.attemptsService.complete(AttemptsController.toOwner(user, attemptToken), attemptId)
    );
  }

  /** Completed attempts of the signed-in user, newest first. */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getHistory(@CurrentUser() user: AuthenticatedUser): Promise<GetAttemptsResponse> {
    return GetAttemptsResponse.fromResult(await this.attemptsService.findCompletedHistory(user.id));
  }

  private static toOwner(user: AuthenticatedUser | undefined, attemptToken: string | undefined): AttemptOwner {
    return user ? { userId: user.id } : { anonymousToken: attemptToken };
  }
}
