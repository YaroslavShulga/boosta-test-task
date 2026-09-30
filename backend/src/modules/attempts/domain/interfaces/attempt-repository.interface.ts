import type { AttemptAnswer } from '../entities/attempt-answer.entity';
import type { Attempt } from '../entities/attempt.entity';
import type { AbandonAttemptsQuery } from '../queries/abandon-attempts.query';
import type { ClaimAttemptsQuery } from '../queries/claim-attempts.query';
import type { GetAttemptsQuery } from '../queries/get-attempts.query';
import type { GetOneAttemptQuery } from '../queries/get-one-attempt.query';

export interface AttemptRepository {
  /** With answers. */
  findOne(query: GetOneAttemptQuery): Promise<Attempt | null>;
  /** With answers, newest completion first. */
  findMany(query: GetAttemptsQuery): Promise<Attempt[]>;
  create(attempt: Attempt): Promise<Attempt>;
  /** Saves the attempt's own fields (owner, status, result); answers are saved with `saveAnswer`. */
  update(attempt: Attempt): Promise<Attempt>;
  abandon(query: AbandonAttemptsQuery): Promise<void>;
  claim(query: ClaimAttemptsQuery): Promise<void>;
  /** Inserts or replaces the answer to a question within an attempt. */
  saveAnswer(answer: AttemptAnswer): Promise<AttemptAnswer>;
}
