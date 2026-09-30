import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AppException } from '../../../../common/errors/app.exception';
import { ErrorCode } from '../../../../common/errors/error-code';
import { QUIZ_VERSION_REPOSITORY } from '../../quizzes.constants';
import type { QuizVersion } from '../entities/quiz-version.entity';
import type { QuizVersionRepository } from '../interfaces/quiz-version-repository.interface';
import { GetCurrentQuizVersionQuery } from '../queries/get-current-quiz-version.query';
import { GetOneQuizVersionQuery } from '../queries/get-one-quiz-version.query';

@Injectable()
export class QuizzesService {
  constructor(
    @Inject(QUIZ_VERSION_REPOSITORY)
    private readonly quizVersionRepository: QuizVersionRepository
  ) {}

  async getCurrent(quizKey: string): Promise<QuizVersion> {
    const quizVersion = await this.quizVersionRepository.findCurrent(new GetCurrentQuizVersionQuery({ quizKey }));
    if (!quizVersion) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.QuizNotFound, 'The quiz is not available.');
    }
    return quizVersion;
  }

  async getById(id: string): Promise<QuizVersion> {
    const quizVersion = await this.quizVersionRepository.findOne(new GetOneQuizVersionQuery({ id }));
    if (!quizVersion) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.QuizNotFound, 'The quiz version was not found.');
    }
    return quizVersion;
  }
}
