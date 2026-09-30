import { Module } from '@nestjs/common';
import { AttemptsModule } from '../attempts/attempts.module';
import { UsersModule } from '../users/users.module';
import { PASSWORD_HASHER } from './auth.constants';
import { AuthService } from './domain/services/auth.service';
import { Argon2PasswordHasher } from './infrastructure/security/argon2-password-hasher';
import { AuthController } from './resources/controllers/auth.controller';

@Module({
  imports: [UsersModule, AttemptsModule],
  controllers: [AuthController],
  providers: [AuthService, { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher }]
})
export class AuthModule {}
