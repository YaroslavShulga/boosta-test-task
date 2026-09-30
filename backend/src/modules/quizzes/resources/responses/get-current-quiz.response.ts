import { Expose, plainToInstance, Type } from 'class-transformer';
import type { QuizVersion } from '../../domain/entities/quiz-version.entity';

export class QuizAnswerOptionResponse {
  @Expose()
  id: string;

  @Expose()
  key: string;

  @Expose()
  position: number;

  @Expose()
  label: string;
}

export class QuizQuestionResponse {
  @Expose()
  id: string;

  @Expose()
  key: string;

  @Expose()
  position: number;

  @Expose()
  text: string;

  @Expose()
  @Type(() => QuizAnswerOptionResponse)
  options: QuizAnswerOptionResponse[];
}

export class GetCurrentQuizResponse {
  @Expose()
  id: string;

  @Expose()
  quizKey: string;

  @Expose()
  version: number;

  @Expose()
  @Type(() => QuizQuestionResponse)
  questions: QuizQuestionResponse[];

  static fromEntity(quizVersion: QuizVersion): GetCurrentQuizResponse {
    return plainToInstance(GetCurrentQuizResponse, quizVersion, {
      excludeExtraneousValues: true
    });
  }
}
