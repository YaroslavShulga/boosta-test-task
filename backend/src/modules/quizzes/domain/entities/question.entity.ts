import type { AnswerOption } from './answer-option.entity';

export class Question {
  id: string;
  quizVersionId: string;
  /** Stable identifier, unique within the quiz version and kept across versions for the same statement. */
  key: string;
  position: number;
  text: string;
  /** Ordered by position. */
  options: AnswerOption[];

  constructor(props: Partial<Question> = {}) {
    Object.assign(this, props);
  }
}
