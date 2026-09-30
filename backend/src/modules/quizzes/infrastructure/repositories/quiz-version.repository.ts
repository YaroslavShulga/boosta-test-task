import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizVersion } from '../../domain/entities/quiz-version.entity';
import type { QuizVersionRepository } from '../../domain/interfaces/quiz-version-repository.interface';
import { GetCurrentQuizVersionQuery } from '../../domain/queries/get-current-quiz-version.query';
import { GetOneQuizVersionQuery } from '../../domain/queries/get-one-quiz-version.query';
import { QuizVersionStatus } from '../../quizzes.constants';
import { QuizVersionMapper } from '../mappers/quiz-version.mapper';
import { QuizVersionOrmEntity } from '../persistence/quiz-version.orm-entity';

const WITH_QUESTIONS = { questions: { options: true } } as const;

@Injectable()
export class TypeOrmQuizVersionRepository implements QuizVersionRepository {
  constructor(
    @InjectRepository(QuizVersionOrmEntity)
    private readonly repository: Repository<QuizVersionOrmEntity>
  ) {}

  async findCurrent(query: GetCurrentQuizVersionQuery): Promise<QuizVersion | null> {
    const orm = await this.repository.findOne({
      where: { quizKey: query.quizKey, status: QuizVersionStatus.Published },
      relations: WITH_QUESTIONS,
      order: { version: 'DESC' }
    });
    return orm ? QuizVersionMapper.toDomain(orm) : null;
  }

  async findOne(query: GetOneQuizVersionQuery): Promise<QuizVersion | null> {
    const orm = await this.repository.findOne({
      where: { id: query.id },
      relations: WITH_QUESTIONS
    });
    return orm ? QuizVersionMapper.toDomain(orm) : null;
  }
}
