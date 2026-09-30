import type { Attempt } from '../../../attempts/domain/entities/attempt.entity';
import type { QuizVersion } from '../../../quizzes/domain/entities/quiz-version.entity';
import type { ReportContent } from './report-content.interface';
import type { ResolvedAnswer } from './resolved-answer.interface';

/** Everything a section builder may use. */
export interface ReportContext {
  attempt: Attempt;
  /** The version the attempt was taken on, not the current one. */
  quizVersion: QuizVersion;
  content: ReportContent;
  answers: ResolvedAnswer[];
  /** Answers by stable question key, for answer-driven sections. */
  answersByQuestionKey: ReadonlyMap<string, ResolvedAnswer>;
  /** The user's earlier completed attempts, newest first, for history-driven sections. */
  previousAttempts: Attempt[];
}
