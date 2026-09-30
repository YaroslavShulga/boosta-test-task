import type { QuizVersion } from '../entities/quiz-version.entity';
import type { GetCurrentQuizVersionQuery } from '../queries/get-current-quiz-version.query';
import type { GetOneQuizVersionQuery } from '../queries/get-one-quiz-version.query';

export interface QuizVersionRepository {
  /** The latest published version of the quiz, with ordered questions and options. */
  findCurrent(query: GetCurrentQuizVersionQuery): Promise<QuizVersion | null>;
  /** Any version (including retired ones), with ordered questions and options. */
  findOne(query: GetOneQuizVersionQuery): Promise<QuizVersion | null>;
}
