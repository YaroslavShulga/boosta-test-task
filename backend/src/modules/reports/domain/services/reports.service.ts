import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException } from '../../../../common/errors/app.exception';
import { ErrorCode } from '../../../../common/errors/error-code';
import type { Attempt } from '../../../attempts/domain/entities/attempt.entity';
import { AttemptsService } from '../../../attempts/domain/services/attempts.service';
import type { QuizVersion } from '../../../quizzes/domain/entities/quiz-version.entity';
import { QuizzesService } from '../../../quizzes/domain/services/quizzes.service';
import { Report } from '../entities/report.entity';
import type { ReportContext } from '../interfaces/report-context.interface';
import type { ReportSection } from '../interfaces/report-section.interface';
import type { ResolvedAnswer } from '../interfaces/resolved-answer.interface';
import { ReportTemplateRegistry } from './report-template-registry.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly quizzesService: QuizzesService,
    private readonly templates: ReportTemplateRegistry
  ) {}

  /** The report for the user's current result (latest completed attempt). */
  async getCurrent(userId: string): Promise<Report> {
    const attempt = await this.attemptsService.findLatestCompleted(userId);
    if (!attempt) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NoCompletedAttempt,
        'You have not completed the quiz yet.'
      );
    }
    return this.compose(userId, attempt);
  }

  /** The report for one of the user's earlier completed attempts. */
  async getForAttempt(userId: string, attemptId: string): Promise<Report> {
    const attempt = await this.attemptsService.findCompleted(userId, attemptId);
    if (!attempt) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.ReportNotFound, 'Report not found.');
    }
    return this.compose(userId, attempt);
  }

  private async compose(userId: string, attempt: Attempt): Promise<Report> {
    if (attempt.score === null || attempt.level === null || !attempt.completedAt) {
      throw new Error(`Attempt ${attempt.id} has no result`);
    }
    const quizVersion = await this.quizzesService.getById(attempt.quizVersionId);
    const template = this.templates.get(quizVersion.reportTemplate);
    const history = await this.attemptsService.findCompletedHistory(userId);
    const completedAt = attempt.completedAt;

    const answers = ReportsService.resolveAnswers(attempt, quizVersion);
    const context: ReportContext = {
      attempt,
      quizVersion,
      content: template.resolveContent(attempt.level, attempt.gender),
      answers,
      answersByQuestionKey: new Map(answers.map((answer) => [answer.question.key, answer])),
      previousAttempts: history.filter(
        (previous) => previous.id !== attempt.id && previous.completedAt !== null && previous.completedAt < completedAt
      )
    };

    return new Report({
      attemptId: attempt.id,
      quizVersionId: quizVersion.id,
      completedAt,
      score: attempt.score,
      level: attempt.level,
      gender: attempt.gender,
      sections: template.sections
        .map((builder) => builder.build(context))
        .filter((section): section is ReportSection => section !== null)
    });
  }

  private static resolveAnswers(attempt: Attempt, quizVersion: QuizVersion): ResolvedAnswer[] {
    const answerByQuestion = new Map(attempt.answers.map((answer) => [answer.questionId, answer]));
    return quizVersion.questions.flatMap((question) => {
      const optionId = answerByQuestion.get(question.id)?.optionId;
      const option = question.options.find((candidate) => candidate.id === optionId);
      return option ? [{ question, option }] : [];
    });
  }
}
