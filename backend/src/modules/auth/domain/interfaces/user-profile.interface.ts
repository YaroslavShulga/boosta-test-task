import type { User } from '../../../users/domain/entities/user.entity';

export interface UserProfile {
  user: User;
  /** False means the frontend should offer the quiz instead of the report. */
  hasCompletedAttempt: boolean;
}
