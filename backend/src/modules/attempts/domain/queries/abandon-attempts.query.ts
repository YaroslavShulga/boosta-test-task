/** Marks the owner's in-progress attempts as abandoned. */
export class AbandonAttemptsQuery {
  userId?: string;
  anonymousTokenHash?: string;

  constructor(props: Partial<AbandonAttemptsQuery> = {}) {
    Object.assign(this, props);
  }
}
