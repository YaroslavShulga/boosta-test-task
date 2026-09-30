import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { AnswerOptionOrmEntity } from '../../../quizzes/infrastructure/persistence/answer-option.orm-entity';
import { QuestionOrmEntity } from '../../../quizzes/infrastructure/persistence/question.orm-entity';
import { AttemptOrmEntity } from './attempt.orm-entity';

@Entity({ name: 'attempt_answers' })
@Unique('UQ_attempt_answers_attempt_question', ['attemptId', 'questionId'])
export class AttemptAnswerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'attempt_id', type: 'uuid' })
  attemptId: string;

  @ManyToOne(() => AttemptOrmEntity, (attempt) => attempt.answers, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'attempt_id' })
  attempt: AttemptOrmEntity;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'question_id' })
  question: QuestionOrmEntity;

  @Column({ name: 'option_id', type: 'uuid' })
  optionId: string;

  @ManyToOne(() => AnswerOptionOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'option_id' })
  option: AnswerOptionOrmEntity;

  @CreateDateColumn({ name: 'answered_at', type: 'timestamptz' })
  answeredAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
