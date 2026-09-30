import { Expose, plainToInstance } from 'class-transformer';
import type { User } from '../../../users/domain/entities/user.entity';

export class SignInResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;

  static fromEntity(user: User): SignInResponse {
    return plainToInstance(SignInResponse, user, {
      excludeExtraneousValues: true
    });
  }
}
