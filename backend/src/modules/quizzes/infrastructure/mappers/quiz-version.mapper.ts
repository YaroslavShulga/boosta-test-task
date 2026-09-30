import { AnswerOption } from '../../domain/entities/answer-option.entity';
import { Question } from '../../domain/entities/question.entity';
import { QuizVersion } from '../../domain/entities/quiz-version.entity';
import { AnswerOptionOrmEntity } from '../persistence/answer-option.orm-entity';
import { QuestionOrmEntity } from '../persistence/question.orm-entity';
import { QuizVersionOrmEntity } from '../persistence/quiz-version.orm-entity';

const byPosition = (a: { position: number }, b: { position: number }) => a.position - b.position;

export class QuizVersionMapper {
  static toDomain(orm: QuizVersionOrmEntity): QuizVersion {
    return new QuizVersion({
      id: orm.id,
      quizKey: orm.quizKey,
      version: orm.version,
      status: orm.status,
      scoringStrategy: orm.scoringStrategy,
      scoringConfig: orm.scoringConfig,
      reportTemplate: orm.reportTemplate,
      publishedAt: orm.publishedAt,
      createdAt: orm.createdAt,
      questions: [...(orm.questions ?? [])]
        .sort(byPosition)
        .map((question) => QuizVersionMapper.questionToDomain(question))
    });
  }

  private static questionToDomain(orm: QuestionOrmEntity): Question {
    return new Question({
      id: orm.id,
      quizVersionId: orm.quizVersionId,
      key: orm.key,
      position: orm.position,
      text: orm.text,
      options: [...(orm.options ?? [])].sort(byPosition).map((option) => QuizVersionMapper.optionToDomain(option))
    });
  }

  private static optionToDomain(orm: AnswerOptionOrmEntity): AnswerOption {
    return new AnswerOption({
      id: orm.id,
      questionId: orm.questionId,
      key: orm.key,
      position: orm.position,
      label: orm.label,
      weight: orm.weight
    });
  }
}
