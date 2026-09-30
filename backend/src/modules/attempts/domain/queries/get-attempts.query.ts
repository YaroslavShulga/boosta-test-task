import type { AttemptStatus } from '../../attempts.constants';

/** Attempts of a user, newest completion first. */
export class GetAttemptsQuery {
  userId: string;
  status?: AttemptStatus;
  limit?: number;

  constructor(props: Partial<GetAttemptsQuery> = {}) {
    Object.assign(this, props);
  }
}
