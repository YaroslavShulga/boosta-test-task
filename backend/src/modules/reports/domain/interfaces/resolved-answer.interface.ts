import type { AnswerOption } from '../../../quizzes/domain/entities/answer-option.entity';
import type { Question } from '../../../quizzes/domain/entities/question.entity';

/** An answer resolved against the quiz version it was given on. */
export interface ResolvedAnswer {
  question: Question;
  option: AnswerOption;
}
