import type { QuizVersion } from '../../../quizzes/domain/entities/quiz-version.entity';
import type { Attempt } from '../entities/attempt.entity';

export interface AttemptProgress {
  attempt: Attempt;
  quizVersion: QuizVersion;
  /** First unanswered question by position; null when every question is answered. */
  nextQuestionId: string | null;
}
