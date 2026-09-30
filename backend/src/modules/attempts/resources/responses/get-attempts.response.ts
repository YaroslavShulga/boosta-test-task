import { Expose, plainToInstance, Type } from 'class-transformer';
import type { Attempt } from '../../domain/entities/attempt.entity';

export class AttemptHistoryItemResponse {
  @Expose()
  id: string;

  @Expose()
  quizVersionId: string;

  @Expose()
  gender: string;

  @Expose()
  score: number;

  @Expose()
  level: string;

  @Expose()
  startedAt: Date;

  @Expose()
  completedAt: Date;
}

export class GetAttemptsResponse {
  @Expose()
  @Type(() => AttemptHistoryItemResponse)
  items: AttemptHistoryItemResponse[];

  static fromResult(attempts: Attempt[]): GetAttemptsResponse {
    return plainToInstance(GetAttemptsResponse, { items: attempts }, { excludeExtraneousValues: true });
  }
}
