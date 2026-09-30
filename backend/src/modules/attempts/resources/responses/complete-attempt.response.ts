import { Expose, plainToInstance } from 'class-transformer';
import type { Attempt } from '../../domain/entities/attempt.entity';

/** The score itself is shown only in the report, which requires an account. */
export class CompleteAttemptResponse {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  completedAt: Date;

  static fromEntity(attempt: Attempt): CompleteAttemptResponse {
    return plainToInstance(CompleteAttemptResponse, attempt, {
      excludeExtraneousValues: true
    });
  }
}
