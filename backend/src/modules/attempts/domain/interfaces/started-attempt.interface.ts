import type { AttemptProgress } from './attempt-progress.interface';

export interface StartedAttempt {
  progress: AttemptProgress;
  /** Raw token to store in the anonymous attempt cookie; null for signed-in users. */
  anonymousToken: string | null;
}
