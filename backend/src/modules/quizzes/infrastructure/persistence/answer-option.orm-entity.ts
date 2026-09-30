import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { QuestionOrmEntity } from './question.orm-entity';

@Entity({ name: 'answer_options' })
@Unique('UQ_answer_options_question_key', ['questionId', 'key'])
@Unique('UQ_answer_options_question_position', ['questionId', 'position'])
export class AnswerOptionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionOrmEntity, (question) => question.options, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'question_id' })
  question: QuestionOrmEntity;

  @Column({ type: 'varchar', length: 64 })
  key: string;

  @Column({ type: 'integer' })
  position: number;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'integer' })
  weight: number;
}
