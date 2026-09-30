import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { ATTEMPT_REPOSITORY } from './attempts.constants';
import { AttemptsService } from './domain/services/attempts.service';
import { AttemptAnswerOrmEntity } from './infrastructure/persistence/attempt-answer.orm-entity';
import { AttemptOrmEntity } from './infrastructure/persistence/attempt.orm-entity';
import { TypeOrmAttemptRepository } from './infrastructure/repositories/attempt.repository';
import { AttemptsController } from './resources/controllers/attempts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttemptOrmEntity, AttemptAnswerOrmEntity]), QuizzesModule],
  controllers: [AttemptsController],
  providers: [AttemptsService, { provide: ATTEMPT_REPOSITORY, useClass: TypeOrmAttemptRepository }],
  exports: [AttemptsService]
})
export class AttemptsModule {}
