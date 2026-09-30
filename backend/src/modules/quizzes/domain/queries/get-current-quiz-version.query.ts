export class GetCurrentQuizVersionQuery {
  quizKey: string;

  constructor(props: Partial<GetCurrentQuizVersionQuery> = {}) {
    Object.assign(this, props);
  }
}
