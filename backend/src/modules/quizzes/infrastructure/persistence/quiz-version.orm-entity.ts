import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { QuizVersionStatus } from '../../quizzes.constants';
import { QuestionOrmEntity } from './question.orm-entity';

@Entity({ name: 'quiz_versions' })
@Unique('UQ_quiz_versions_key_version', ['quizKey', 'version'])
export class QuizVersionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quiz_key', type: 'varchar', length: 64 })
  quizKey: string;

  @Column({ type: 'integer' })
  version: number;

  @Column({ type: 'varchar', length: 16 })
  status: QuizVersionStatus;

  @Column({ name: 'scoring_strategy', type: 'varchar', length: 64 })
  scoringStrategy: string;

  @Column({ name: 'scoring_config', type: 'jsonb', default: {} })
  scoringConfig: Record<string, unknown>;

  @Column({ name: 'report_template', type: 'varchar', length: 64 })
  reportTemplate: string;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => QuestionOrmEntity, (question) => question.quizVersion)
  questions: QuestionOrmEntity[];
}
