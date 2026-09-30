import type { TraitLevel } from '../../quizzes.constants';

export interface ScoringResult {
  /** 0–100. */
  score: number;
  level: TraitLevel;
  /** Everything needed to explain the score later, independent of current rules. */
  snapshot: Record<string, unknown>;
}
