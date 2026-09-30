import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from '../../../users/domain/entities/user.entity';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../auth.constants';

export class SignUpRequestPayload {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @MaxLength(320)
  email: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  })
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string;

  toEntity(): User {
    return new User({ email: this.email });
  }
}
