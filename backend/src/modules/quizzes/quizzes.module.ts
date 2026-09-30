import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './domain/services/quizzes.service';
import { LinearAgreementScoringStrategy } from './domain/services/scoring/linear-agreement.scoring-strategy';
import { ScoringService } from './domain/services/scoring/scoring.service';
import { AnswerOptionOrmEntity } from './infrastructure/persistence/answer-option.orm-entity';
import { QuestionOrmEntity } from './infrastructure/persistence/question.orm-entity';
import { QuizVersionOrmEntity } from './infrastructure/persistence/quiz-version.orm-entity';
import { TypeOrmQuizVersionRepository } from './infrastructure/repositories/quiz-version.repository';
import { QUIZ_VERSION_REPOSITORY, SCORING_STRATEGIES } from './quizzes.constants';
import { QuizzesController } from './resources/controllers/quizzes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuizVersionOrmEntity, QuestionOrmEntity, AnswerOptionOrmEntity])],
  controllers: [QuizzesController],
  providers: [
    QuizzesService,
    ScoringService,
    LinearAgreementScoringStrategy,
    {
      // Register new scoring strategies here; quiz versions select one by key.
      provide: SCORING_STRATEGIES,
      useFactory: (linear: LinearAgreementScoringStrategy) => [linear],
      inject: [LinearAgreementScoringStrategy]
    },
    {
      provide: QUIZ_VERSION_REPOSITORY,
      useClass: TypeOrmQuizVersionRepository
    }
  ],
  exports: [QuizzesService, ScoringService]
})
export class QuizzesModule {}
