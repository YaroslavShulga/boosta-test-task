import { Controller, Get } from '@nestjs/common';
import { QuizzesService } from '../../domain/services/quizzes.service';
import { DEFAULT_QUIZ_KEY } from '../../quizzes.constants';
import { GetCurrentQuizResponse } from '../responses/get-current-quiz.response';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  /** The published quiz version: ordered questions and options. Option weights are not exposed. */
  @Get('current')
  async getCurrent(): Promise<GetCurrentQuizResponse> {
    return GetCurrentQuizResponse.fromEntity(await this.quizzesService.getCurrent(DEFAULT_QUIZ_KEY));
  }
}
