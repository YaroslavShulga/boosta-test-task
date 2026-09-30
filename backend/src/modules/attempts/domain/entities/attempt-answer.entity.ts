/** An answer referenced by stable ids of the question and option in the attempt's quiz version. */
export class AttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  optionId: string;
  answeredAt: Date;
  updatedAt: Date;

  constructor(props: Partial<AttemptAnswer> = {}) {
    Object.assign(this, props);
  }
}
