import { Expose, plainToInstance } from 'class-transformer';
import type { User } from '../../../users/domain/entities/user.entity';

export class SignUpResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;

  static fromEntity(user: User): SignUpResponse {
    return plainToInstance(SignUpResponse, user, {
      excludeExtraneousValues: true
    });
  }
}
