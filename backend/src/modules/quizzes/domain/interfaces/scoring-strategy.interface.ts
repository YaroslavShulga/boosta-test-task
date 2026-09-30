import type { QuizVersion } from '../entities/quiz-version.entity';
import type { ScoringAnswer } from './scoring-answer.interface';
import type { ScoringResult } from './scoring-result.interface';

/** A scoring rule. Quiz versions reference a strategy by `key`, so rules can change per version. */
export interface ScoringStrategy {
  readonly key: string;
  score(quizVersion: QuizVersion, answers: ScoringAnswer[]): ScoringResult;
}
