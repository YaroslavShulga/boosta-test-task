import { Injectable } from '@nestjs/common';
import { TraitLevel } from '../../../quizzes.constants';
import type { QuizVersion } from '../../entities/quiz-version.entity';
import type { ScoringAnswer } from '../../interfaces/scoring-answer.interface';
import type { ScoringResult } from '../../interfaces/scoring-result.interface';
import type { ScoringStrategy } from '../../interfaces/scoring-strategy.interface';

/**
 * Sums option weights and normalises to 0–100 against the maximum possible sum.
 * Config: `{ highThreshold: number }`: a score at or above it is High.
 */
@Injectable()
export class LinearAgreementScoringStrategy implements ScoringStrategy {
  static readonly KEY = 'linear-agreement';
  readonly key = LinearAgreementScoringStrategy.KEY;

  score(quizVersion: QuizVersion, answers: ScoringAnswer[]): ScoringResult {
    const highThreshold = Number(quizVersion.scoringConfig.highThreshold);
    if (!Number.isFinite(highThreshold)) {
      throw new Error(`Quiz version ${quizVersion.id} has no numeric scoringConfig.highThreshold`);
    }

    const optionByQuestion = new Map(answers.map((answer) => [answer.questionId, answer.optionId]));
    let rawSum = 0;
    let maxSum = 0;
    for (const question of quizVersion.questions) {
      const weights = question.options.map((option) => option.weight);
      const maxWeight = Math.max(...weights);
      const minWeight = Math.min(...weights);
      const option = question.options.find((candidate) => candidate.id === optionByQuestion.get(question.id));
      if (!option) {
        throw new Error(`Question ${question.id} has no valid answer`);
      }
      rawSum += option.weight - minWeight;
      maxSum += maxWeight - minWeight;
    }

    const score = maxSum === 0 ? 0 : Math.round((rawSum / maxSum) * 100);
    return {
      score,
      level: score >= highThreshold ? TraitLevel.High : TraitLevel.Low,
      snapshot: {
        strategy: this.key,
        config: { highThreshold },
        rawSum,
        maxSum
      }
    };
  }
}
