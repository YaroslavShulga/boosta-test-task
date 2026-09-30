import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../../../../common/auth/jwt-payload.interface';
import { AppException } from '../../../../common/errors/app.exception';
import { ErrorCode } from '../../../../common/errors/error-code';
import { AttemptsService } from '../../../attempts/domain/services/attempts.service';
import type { User } from '../../../users/domain/entities/user.entity';
import { UsersService } from '../../../users/domain/services/users.service';
import { PASSWORD_HASHER } from '../../auth.constants';
import type { AuthSession } from '../interfaces/auth-session.interface';
import type { PasswordHasher } from '../interfaces/password-hasher.interface';
import type { UserProfile } from '../interfaces/user-profile.interface';

@Injectable()
export class AuthService {
  private dummyHash: Promise<string> | null = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly attemptsService: AttemptsService,
    private readonly jwtService: JwtService,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher
  ) {}

  /**
   * Creates the account, signs the user in and links the anonymous attempts
   * of this browser (the quiz just taken) to the new account.
   */
  async signUp(draft: User, password: string, attemptToken: string | undefined): Promise<AuthSession> {
    const passwordHash = await this.passwordHasher.hash(password);
    const user = await this.usersService.create(draft.email, passwordHash);
    await this.attemptsService.claimAnonymous(attemptToken, user.id);
    return this.createSession(user);
  }

  /** Signs the user in; a fresh anonymous result from this browser becomes the current one. */
  async signIn(credentials: User, password: string, attemptToken: string | undefined): Promise<AuthSession> {
    const user = await this.usersService.findByEmail(credentials.email);
    // Verify against a dummy hash for unknown emails, so response time doesn't reveal which emails exist.
    const valid = await this.passwordHasher.verify(user?.passwordHash ?? (await this.getDummyHash()), password);
    if (!user || !valid) {
      throw new AppException(HttpStatus.UNAUTHORIZED, ErrorCode.InvalidCredentials, 'Incorrect email or password.');
    }
    await this.attemptsService.claimAnonymous(attemptToken, user.id);
    return this.createSession(user);
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new AppException(HttpStatus.UNAUTHORIZED, ErrorCode.Unauthorized, 'Please sign in to continue.');
    }
    return {
      user,
      hasCompletedAttempt: (await this.attemptsService.findLatestCompleted(user.id)) !== null
    };
  }

  private async createSession(user: User): Promise<AuthSession> {
    const payload: JwtPayload = { sub: user.id };
    return { user, accessToken: await this.jwtService.signAsync(payload) };
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= this.passwordHasher.hash('dummy-password-for-timing');
    return this.dummyHash;
  }
}
