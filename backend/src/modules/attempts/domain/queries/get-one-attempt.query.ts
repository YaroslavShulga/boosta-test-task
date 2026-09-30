import type { AttemptStatus } from '../../attempts.constants';

export class GetOneAttemptQuery {
  id?: string;
  userId?: string;
  anonymousTokenHash?: string;
  status?: AttemptStatus;

  constructor(props: Partial<GetOneAttemptQuery> = {}) {
    Object.assign(this, props);
  }
}
