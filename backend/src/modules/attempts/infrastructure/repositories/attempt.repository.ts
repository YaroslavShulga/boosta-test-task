import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AttemptStatus } from '../../attempts.constants';
import { AttemptAnswer } from '../../domain/entities/attempt-answer.entity';
import { Attempt } from '../../domain/entities/attempt.entity';
import type { AttemptRepository } from '../../domain/interfaces/attempt-repository.interface';
import { AbandonAttemptsQuery } from '../../domain/queries/abandon-attempts.query';
import { ClaimAttemptsQuery } from '../../domain/queries/claim-attempts.query';
import { GetAttemptsQuery } from '../../domain/queries/get-attempts.query';
import { GetOneAttemptQuery } from '../../domain/queries/get-one-attempt.query';
import { AttemptMapper } from '../mappers/attempt.mapper';
import { AttemptAnswerOrmEntity } from '../persistence/attempt-answer.orm-entity';
import { AttemptOrmEntity } from '../persistence/attempt.orm-entity';

@Injectable()
export class TypeOrmAttemptRepository implements AttemptRepository {
  constructor(
    @InjectRepository(AttemptOrmEntity)
    private readonly attempts: Repository<AttemptOrmEntity>,
    @InjectRepository(AttemptAnswerOrmEntity)
    private readonly answers: Repository<AttemptAnswerOrmEntity>
  ) {}

  async findOne(query: GetOneAttemptQuery): Promise<Attempt | null> {
    const where: FindOptionsWhere<AttemptOrmEntity> = {};
    if (query.id) where.id = query.id;
    if (query.userId) where.userId = query.userId;
    if (query.anonymousTokenHash) {
      where.anonymousTokenHash = query.anonymousTokenHash;
    }
    if (query.status) where.status = query.status;
    // Never match on a filter without an identity (e.g. status only).
    if (!where.id && !where.userId && !where.anonymousTokenHash) {
      return null;
    }

    const orm = await this.attempts.findOne({
      where,
      relations: { answers: true },
      order: { startedAt: 'DESC' }
    });
    return orm ? AttemptMapper.toDomain(orm) : null;
  }

  async findMany(query: GetAttemptsQuery): Promise<Attempt[]> {
    const orms = await this.attempts.find({
      where: {
        userId: query.userId,
        ...(query.status ? { status: query.status } : {})
      },
      relations: { answers: true },
      order: {
        completedAt: { direction: 'DESC', nulls: 'LAST' },
        startedAt: 'DESC'
      },
      ...(query.limit ? { take: query.limit } : {})
    });
    return orms.map((orm) => AttemptMapper.toDomain(orm));
  }

  async create(attempt: Attempt): Promise<Attempt> {
    const saved = await this.attempts.save(AttemptMapper.toOrm(attempt));
    saved.answers = [];
    return AttemptMapper.toDomain(saved);
  }

  async update(attempt: Attempt): Promise<Attempt> {
    // `answers` is left undefined on the ORM entity, so save() doesn't touch them.
    await this.attempts.save(AttemptMapper.toOrm(attempt));
    const updated = await this.findOne(new GetOneAttemptQuery({ id: attempt.id }));
    if (!updated) {
      throw new Error(`Attempt ${attempt.id} disappeared during update`);
    }
    return updated;
  }

  async abandon(query: AbandonAttemptsQuery): Promise<void> {
    if (!query.userId && !query.anonymousTokenHash) {
      return;
    }
    await this.attempts.update(
      {
        status: AttemptStatus.InProgress,
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.anonymousTokenHash ? { anonymousTokenHash: query.anonymousTokenHash } : {})
      },
      { status: AttemptStatus.Abandoned }
    );
  }

  async claim(query: ClaimAttemptsQuery): Promise<void> {
    await this.attempts.update(
      { anonymousTokenHash: query.anonymousTokenHash },
      { userId: query.userId, anonymousTokenHash: null }
    );
  }

  async saveAnswer(answer: AttemptAnswer): Promise<AttemptAnswer> {
    await this.answers.upsert(
      {
        attemptId: answer.attemptId,
        questionId: answer.questionId,
        optionId: answer.optionId,
        updatedAt: new Date()
      },
      { conflictPaths: ['attemptId', 'questionId'] }
    );
    const saved = await this.answers.findOneOrFail({
      where: { attemptId: answer.attemptId, questionId: answer.questionId }
    });
    return AttemptMapper.answerToDomain(saved);
  }
}
