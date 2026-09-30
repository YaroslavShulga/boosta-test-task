import { Exclude, Expose } from 'class-transformer';

export class User {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  passwordHash: string;

  @Expose()
  createdAt: Date;

  constructor(props: Partial<User> = {}) {
    Object.assign(this, props);
  }
}
