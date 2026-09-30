import { Expose, plainToInstance } from 'class-transformer';
import type { UserProfile } from '../../domain/interfaces/user-profile.interface';

export class GetMeResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  hasCompletedAttempt: boolean;

  static fromResult(profile: UserProfile): GetMeResponse {
    return plainToInstance(
      GetMeResponse,
      {
        id: profile.user.id,
        email: profile.user.email,
        hasCompletedAttempt: profile.hasCompletedAttempt
      },
      { excludeExtraneousValues: true }
    );
  }
}
