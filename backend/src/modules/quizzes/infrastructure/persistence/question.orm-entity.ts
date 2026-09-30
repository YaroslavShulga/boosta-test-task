import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AnswerOptionOrmEntity } from './answer-option.orm-entity';
import { QuizVersionOrmEntity } from './quiz-version.orm-entity';

@Entity({ name: 'questions' })
@Unique('UQ_questions_version_key', ['quizVersionId', 'key'])
@Unique('UQ_questions_version_position', ['quizVersionId', 'position'])
export class QuestionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quiz_version_id', type: 'uuid' })
  quizVersionId: string;

  @ManyToOne(() => QuizVersionOrmEntity, (version) => version.questions, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'quiz_version_id' })
  quizVersion: QuizVersionOrmEntity;

  @Column({ type: 'varchar', length: 64 })
  key: string;

  @Column({ type: 'integer' })
  position: number;

  @Column({ type: 'text' })
  text: string;

  @OneToMany(() => AnswerOptionOrmEntity, (option) => option.question)
  options: AnswerOptionOrmEntity[];
}
