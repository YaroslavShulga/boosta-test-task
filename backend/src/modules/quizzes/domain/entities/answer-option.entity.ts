export class AnswerOption {
  id: string;
  questionId: string;
  /** Stable identifier, unique within the question. */
  key: string;
  position: number;
  label: string;
  /** Used by scoring strategies. Never exposed to clients. */
  weight: number;

  constructor(props: Partial<AnswerOption> = {}) {
    Object.assign(this, props);
  }
}
