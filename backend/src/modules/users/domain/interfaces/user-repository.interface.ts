import type { User } from '../entities/user.entity';
import type { GetOneUserQuery } from '../queries/get-one-user.query';

export interface UserRepository {
  findOne(query: GetOneUserQuery): Promise<User | null>;
  /** Persists a new user. Throws a unique-violation error for a duplicate email. */
  create(user: User): Promise<User>;
}
