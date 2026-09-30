import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { User } from '../../../users/domain/entities/user.entity';
import { PASSWORD_MAX_LENGTH } from '../../auth.constants';

export class SignInRequestPayload {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @MaxLength(320)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter your password.' })
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string;

  toEntity(): User {
    return new User({ email: this.email });
  }
}
