export class GetOneUserQuery {
  id?: string;
  email?: string;

  constructor(props: Partial<GetOneUserQuery> = {}) {
    Object.assign(this, props);
  }
}
