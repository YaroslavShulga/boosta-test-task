import { IsEnum } from 'class-validator';
import { Gender } from '../../attempts.constants';
import { Attempt } from '../../domain/entities/attempt.entity';

export class StartAttemptRequestPayload {
  @IsEnum(Gender)
  gender: Gender;

  toEntity(): Attempt {
    return new Attempt({ gender: this.gender });
  }
}
