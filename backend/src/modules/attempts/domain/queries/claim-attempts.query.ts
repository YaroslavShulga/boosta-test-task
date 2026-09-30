/** Moves every attempt of an anonymous token to a user. */
export class ClaimAttemptsQuery {
  anonymousTokenHash: string;
  userId: string;

  constructor(props: Partial<ClaimAttemptsQuery> = {}) {
    Object.assign(this, props);
  }
}
