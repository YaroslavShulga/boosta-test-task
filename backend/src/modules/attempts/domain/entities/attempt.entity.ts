import type { TraitLevel } from '../../../quizzes/quizzes.constants';
import type { AttemptStatus, Gender } from '../../attempts.constants';
import type { AttemptAnswer } from './attempt-answer.entity';

/** One pass through a specific quiz version. Attempts are never deleted. */
export class Attempt {
  id: string;
  quizVersionId: string;
  /** Null while the attempt is anonymous. */
  userId: string | null;
  /** sha256 of the anonymous attempt token; cleared once a user claims the attempt. */
  anonymousTokenHash: string | null;
  gender: Gender;
  status: AttemptStatus;
  /** Set on completion, together with `level` and `scoringSnapshot`. */
  score: number | null;
  level: TraitLevel | null;
  scoringSnapshot: Record<string, unknown> | null;
  startedAt: Date;
  completedAt: Date | null;
  updatedAt: Date;
  answers: AttemptAnswer[];

  constructor(props: Partial<Attempt> = {}) {
    Object.assign(this, props);
  }
}
