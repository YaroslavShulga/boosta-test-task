import { AttemptAnswer } from '../../domain/entities/attempt-answer.entity';
import { Attempt } from '../../domain/entities/attempt.entity';
import { AttemptAnswerOrmEntity } from '../persistence/attempt-answer.orm-entity';
import { AttemptOrmEntity } from '../persistence/attempt.orm-entity';

export class AttemptMapper {
  static toDomain(orm: AttemptOrmEntity): Attempt {
    return new Attempt({
      id: orm.id,
      quizVersionId: orm.quizVersionId,
      userId: orm.userId,
      anonymousTokenHash: orm.anonymousTokenHash,
      gender: orm.gender,
      status: orm.status,
      score: orm.score,
      level: orm.level,
      scoringSnapshot: orm.scoringSnapshot,
      startedAt: orm.startedAt,
      completedAt: orm.completedAt,
      updatedAt: orm.updatedAt,
      answers: (orm.answers ?? []).map((answer) => AttemptMapper.answerToDomain(answer))
    });
  }

  static toOrm(attempt: Attempt): AttemptOrmEntity {
    const orm = new AttemptOrmEntity();
    if (attempt.id) {
      orm.id = attempt.id;
    }
    orm.quizVersionId = attempt.quizVersionId;
    orm.userId = attempt.userId;
    orm.anonymousTokenHash = attempt.anonymousTokenHash;
    orm.gender = attempt.gender;
    orm.status = attempt.status;
    orm.score = attempt.score ?? null;
    orm.level = attempt.level ?? null;
    orm.scoringSnapshot = attempt.scoringSnapshot ?? null;
    orm.completedAt = attempt.completedAt ?? null;
    return orm;
  }

  static answerToDomain(orm: AttemptAnswerOrmEntity): AttemptAnswer {
    return new AttemptAnswer({
      id: orm.id,
      attemptId: orm.attemptId,
      questionId: orm.questionId,
      optionId: orm.optionId,
      answeredAt: orm.answeredAt,
      updatedAt: orm.updatedAt
    });
  }
}
