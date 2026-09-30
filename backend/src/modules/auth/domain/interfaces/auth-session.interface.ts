import type { User } from '../../../users/domain/entities/user.entity';

export interface AuthSession {
  user: User;
  accessToken: string;
}
