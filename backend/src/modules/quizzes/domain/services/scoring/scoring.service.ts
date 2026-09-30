import { Inject, Injectable } from '@nestjs/common';
import { SCORING_STRATEGIES } from '../../../quizzes.constants';
import type { QuizVersion } from '../../entities/quiz-version.entity';
import type { ScoringAnswer } from '../../interfaces/scoring-answer.interface';
import type { ScoringResult } from '../../interfaces/scoring-result.interface';
import type { ScoringStrategy } from '../../interfaces/scoring-strategy.interface';

/** Scores an attempt with the strategy its quiz version names. */
@Injectable()
export class ScoringService {
  private readonly strategies: Map<string, ScoringStrategy>;

  constructor(@Inject(SCORING_STRATEGIES) strategies: ScoringStrategy[]) {
    this.strategies = new Map(strategies.map((strategy) => [strategy.key, strategy]));
  }

  score(quizVersion: QuizVersion, answers: ScoringAnswer[]): ScoringResult {
    const strategy = this.strategies.get(quizVersion.scoringStrategy);
    if (!strategy) {
      throw new Error(`Unknown scoring strategy "${quizVersion.scoringStrategy}" for quiz version ${quizVersion.id}`);
    }
    return strategy.score(quizVersion, answers);
  }
}
