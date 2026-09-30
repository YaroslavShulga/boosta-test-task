import { IsUUID } from 'class-validator';
import { AttemptAnswer } from '../../domain/entities/attempt-answer.entity';

export class SaveAnswerRequestPayload {
  @IsUUID()
  optionId: string;

  toEntity(attemptId: string, questionId: string): AttemptAnswer {
    return new AttemptAnswer({
      attemptId,
      questionId,
      optionId: this.optionId
    });
  }
}
