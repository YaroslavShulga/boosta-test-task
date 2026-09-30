import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AppException } from '../../../../common/errors/app.exception';
import { ErrorCode } from '../../../../common/errors/error-code';
import { isUniqueViolation } from '../../../../common/errors/postgres-error';
import { USER_REPOSITORY } from '../../users.constants';
import { User } from '../entities/user.entity';
import type { UserRepository } from '../interfaces/user-repository.interface';
import { GetOneUserQuery } from '../queries/get-one-user.query';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne(new GetOneUserQuery({ id }));
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne(new GetOneUserQuery({ email: UsersService.normalizeEmail(email) }));
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const normalizedEmail = UsersService.normalizeEmail(email);
    if (await this.findByEmail(normalizedEmail)) {
      throw UsersService.emailTaken();
    }
    try {
      return await this.userRepository.create(new User({ email: normalizedEmail, passwordHash }));
    } catch (error) {
      // Two concurrent sign-ups with the same email: the unique index wins.
      if (isUniqueViolation(error)) {
        throw UsersService.emailTaken();
      }
      throw error;
    }
  }

  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private static emailTaken(): AppException {
    return new AppException(HttpStatus.CONFLICT, ErrorCode.EmailTaken, 'Bad email');
  }
}
