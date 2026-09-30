import { createHash, randomBytes } from 'node:crypto';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AppException } from '../../../../common/errors/app.exception';
import { ErrorCode } from '../../../../common/errors/error-code';
import type { QuizVersion } from '../../../quizzes/domain/entities/quiz-version.entity';
import { QuizzesService } from '../../../quizzes/domain/services/quizzes.service';
import { ScoringService } from '../../../quizzes/domain/services/scoring/scoring.service';
import { DEFAULT_QUIZ_KEY } from '../../../quizzes/quizzes.constants';
import { ATTEMPT_REPOSITORY, AttemptStatus } from '../../attempts.constants';
import { AttemptAnswer } from '../entities/attempt-answer.entity';
import { Attempt } from '../entities/attempt.entity';
import type { AttemptOwner } from '../interfaces/attempt-owner.interface';
import type { AttemptProgress } from '../interfaces/attempt-progress.interface';
import type { AttemptRepository } from '../interfaces/attempt-repository.interface';
import type { StartedAttempt } from '../interfaces/started-attempt.interface';
import { AbandonAttemptsQuery } from '../queries/abandon-attempts.query';
import { ClaimAttemptsQuery } from '../queries/claim-attempts.query';
import { GetAttemptsQuery } from '../queries/get-attempts.query';
import { GetOneAttemptQuery } from '../queries/get-one-attempt.query';

type OwnerFilter = Pick<GetOneAttemptQuery, 'userId' | 'anonymousTokenHash'>;

@Injectable()
export class AttemptsService {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: AttemptRepository,
    private readonly quizzesService: QuizzesService,
    private readonly scoringService: ScoringService
  ) {}

  /**
   * Starts a new attempt on the current quiz version. The owner's unfinished
   * attempt (if any) is kept but marked abandoned.
   */
  async start(owner: AttemptOwner, draft: Attempt): Promise<StartedAttempt> {
    const quizVersion = await this.quizzesService.getCurrent(DEFAULT_QUIZ_KEY);
    let anonymousToken: string | null = null;
    let ownerFilter: OwnerFilter;
    if (owner.userId) {
      ownerFilter = { userId: owner.userId };
    } else {
      // Reuse the browser's token so its earlier anonymous attempts stay claimable together.
      anonymousToken = owner.anonymousToken ?? randomBytes(32).toString('base64url');
      ownerFilter = {
        anonymousTokenHash: AttemptsService.hashToken(anonymousToken)
      };
    }

    await this.attemptRepository.abandon(new AbandonAttemptsQuery(ownerFilter));
    const attempt = await this.attemptRepository.create(
      new Attempt({
        quizVersionId: quizVersion.id,
        userId: ownerFilter.userId ?? null,
        anonymousTokenHash: ownerFilter.anonymousTokenHash ?? null,
        gender: draft.gender,
        status: AttemptStatus.InProgress
      })
    );
    return {
      progress: AttemptsService.toProgress(attempt, quizVersion),
      anonymousToken
    };
  }

  async getInProgress(owner: AttemptOwner): Promise<AttemptProgress> {
    const attempt = await this.findOwned(owner, {
      status: AttemptStatus.InProgress
    });
    return AttemptsService.toProgress(attempt, await this.quizzesService.getById(attempt.quizVersionId));
  }

  /** Saves (or changes) the answer to one question of an in-progress attempt. */
  async saveAnswer(owner: AttemptOwner, answer: AttemptAnswer): Promise<AttemptProgress> {
    const attempt = await this.findOwnedInProgress(owner, answer.attemptId);
    const quizVersion = await this.quizzesService.getById(attempt.quizVersionId);

    const question = quizVersion.questions.find((candidate) => candidate.id === answer.questionId);
    if (!question) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        ErrorCode.InvalidQuestion,
        'This question is not part of the attempt.'
      );
    }
    if (!question.options.some((option) => option.id === answer.optionId)) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        ErrorCode.InvalidOption,
        'This option does not belong to the question.'
      );
    }

    const saved = await this.attemptRepository.saveAnswer(answer);
    const updated = new Attempt(attempt);
    updated.answers = [...attempt.answers.filter((existing) => existing.questionId !== saved.questionId), saved];
    return AttemptsService.toProgress(updated, quizVersion);
  }

  /** Scores the attempt once every question is answered and stores the result snapshot. */
  async complete(owner: AttemptOwner, attemptId: string): Promise<Attempt> {
    const existing = await this.findOwned(owner, { id: attemptId });
    if (existing.status === AttemptStatus.Completed) {
      return existing;
    }
    const attempt = AttemptsService.assertInProgress(existing);
    const quizVersion = await this.quizzesService.getById(attempt.quizVersionId);
    if (AttemptsService.nextQuestionId(attempt, quizVersion) !== null) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.AttemptIncomplete,
        'Please answer every question before finishing the quiz.'
      );
    }

    const result = this.scoringService.score(quizVersion, attempt.answers);
    const completed = new Attempt(attempt);
    completed.status = AttemptStatus.Completed;
    completed.score = result.score;
    completed.level = result.level;
    completed.scoringSnapshot = result.snapshot;
    completed.completedAt = new Date();
    return this.attemptRepository.update(completed);
  }

  /**
   * Links the anonymous attempts of a browser to a user who just signed up or in.
   * A claimed in-progress attempt replaces the user's own unfinished one.
   */
  async claimAnonymous(anonymousToken: string | undefined, userId: string): Promise<void> {
    if (!anonymousToken) {
      return;
    }
    const anonymousTokenHash = AttemptsService.hashToken(anonymousToken);
    const claimedInProgress = await this.attemptRepository.findOne(
      new GetOneAttemptQuery({
        anonymousTokenHash,
        status: AttemptStatus.InProgress
      })
    );
    if (claimedInProgress) {
      await this.attemptRepository.abandon(new AbandonAttemptsQuery({ userId }));
    }
    await this.attemptRepository.claim(new ClaimAttemptsQuery({ anonymousTokenHash, userId }));
  }

  /** The user's current result: the latest completed attempt. */
  async findLatestCompleted(userId: string): Promise<Attempt | null> {
    const [latest] = await this.attemptRepository.findMany(
      new GetAttemptsQuery({
        userId,
        status: AttemptStatus.Completed,
        limit: 1
      })
    );
    return latest ?? null;
  }

  findCompleted(userId: string, attemptId: string): Promise<Attempt | null> {
    return this.attemptRepository.findOne(
      new GetOneAttemptQuery({
        id: attemptId,
        userId,
        status: AttemptStatus.Completed
      })
    );
  }

  /** Completed attempts of the user, newest first. */
  findCompletedHistory(userId: string): Promise<Attempt[]> {
    return this.attemptRepository.findMany(new GetAttemptsQuery({ userId, status: AttemptStatus.Completed }));
  }

  private async findOwnedInProgress(owner: AttemptOwner, attemptId: string): Promise<Attempt> {
    return AttemptsService.assertInProgress(await this.findOwned(owner, { id: attemptId }));
  }

  private async findOwned(owner: AttemptOwner, filter: Pick<GetOneAttemptQuery, 'id' | 'status'>): Promise<Attempt> {
    const ownerFilter = AttemptsService.toOwnerFilter(owner);
    const attempt = ownerFilter
      ? await this.attemptRepository.findOne(new GetOneAttemptQuery({ ...filter, ...ownerFilter }))
      : null;
    if (!attempt) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.AttemptNotFound, 'Quiz attempt not found.');
    }
    return attempt;
  }

  private static assertInProgress(attempt: Attempt): Attempt {
    if (attempt.status !== AttemptStatus.InProgress) {
      throw new AppException(
        HttpStatus.CONFLICT,
        ErrorCode.AttemptNotInProgress,
        'This quiz attempt is already finished.'
      );
    }
    return attempt;
  }

  private static toOwnerFilter(owner: AttemptOwner): OwnerFilter | null {
    if (owner.userId) {
      return { userId: owner.userId };
    }
    if (owner.anonymousToken) {
      return {
        anonymousTokenHash: AttemptsService.hashToken(owner.anonymousToken)
      };
    }
    return null;
  }

  private static toProgress(attempt: Attempt, quizVersion: QuizVersion): AttemptProgress {
    return {
      attempt,
      quizVersion,
      nextQuestionId: AttemptsService.nextQuestionId(attempt, quizVersion)
    };
  }

  private static nextQuestionId(attempt: Attempt, quizVersion: QuizVersion): string | null {
    const answered = new Set(attempt.answers.map((answer) => answer.questionId));
    return quizVersion.questions.find((question) => !answered.has(question.id))?.id ?? null;
  }

  private static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
