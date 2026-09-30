import type { QuizVersionStatus } from '../../quizzes.constants';
import type { Question } from './question.entity';

/** An immutable, published snapshot of a quiz: questions, options and the rules to score and report on it. */
export class QuizVersion {
  id: string;
  quizKey: string;
  version: number;
  status: QuizVersionStatus;
  /** Key of the `ScoringStrategy` that scores attempts on this version. */
  scoringStrategy: string;
  scoringConfig: Record<string, unknown>;
  /** Key of the report template used for attempts on this version. */
  reportTemplate: string;
  publishedAt: Date | null;
  createdAt: Date;
  /** Ordered by position. */
  questions: Question[];

  constructor(props: Partial<QuizVersion> = {}) {
    Object.assign(this, props);
  }
}
