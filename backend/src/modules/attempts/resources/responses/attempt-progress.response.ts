import { Expose, plainToInstance, Type } from 'class-transformer';
import type { AttemptProgress } from '../../domain/interfaces/attempt-progress.interface';

export class AttemptProgressAnswerResponse {
  @Expose()
  questionId: string;

  @Expose()
  optionId: string;
}

/** An in-progress attempt with enough state for the frontend to resume it. */
export class AttemptProgressResponse {
  @Expose()
  id: string;

  @Expose()
  quizVersionId: string;

  @Expose()
  gender: string;

  @Expose()
  status: string;

  @Expose()
  startedAt: Date;

  @Expose()
  @Type(() => AttemptProgressAnswerResponse)
  answers: AttemptProgressAnswerResponse[];

  @Expose()
  totalQuestions: number;

  @Expose()
  answeredQuestions: number;

  @Expose()
  nextQuestionId: string | null;

  static fromResult(progress: AttemptProgress): AttemptProgressResponse {
    const { attempt, quizVersion, nextQuestionId } = progress;
    return plainToInstance(
      AttemptProgressResponse,
      {
        id: attempt.id,
        quizVersionId: attempt.quizVersionId,
        gender: attempt.gender,
        status: attempt.status,
        startedAt: attempt.startedAt,
        answers: attempt.answers.map((answer) => ({
          questionId: answer.questionId,
          optionId: answer.optionId
        })),
        totalQuestions: quizVersion.questions.length,
        answeredQuestions: attempt.answers.length,
        nextQuestionId
      },
      { excludeExtraneousValues: true }
    );
  }
}
