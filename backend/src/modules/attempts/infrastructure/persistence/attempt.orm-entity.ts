import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';
import { QuizVersionOrmEntity } from '../../../quizzes/infrastructure/persistence/quiz-version.orm-entity';
import { TraitLevel } from '../../../quizzes/quizzes.constants';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { AttemptStatus, Gender } from '../../attempts.constants';
import { AttemptAnswerOrmEntity } from './attempt-answer.orm-entity';

@Entity({ name: 'attempts' })
@Index('IDX_attempts_user_completed', ['userId', 'completedAt'])
export class AttemptOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quiz_version_id', type: 'uuid' })
  quizVersionId: string;

  @ManyToOne(() => QuizVersionOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'quiz_version_id' })
  quizVersion: QuizVersionOrmEntity;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity | null;

  @Index('IDX_attempts_anonymous_token_hash')
  @Column({
    name: 'anonymous_token_hash',
    type: 'varchar',
    length: 64,
    nullable: true
  })
  anonymousTokenHash: string | null;

  @Column({ type: 'varchar', length: 16 })
  gender: Gender;

  @Column({ type: 'varchar', length: 16 })
  status: AttemptStatus;

  @Column({ type: 'integer', nullable: true })
  score: number | null;

  @Column({ type: 'varchar', length: 16, nullable: true })
  level: TraitLevel | null;

  @Column({ name: 'scoring_snapshot', type: 'jsonb', nullable: true })
  scoringSnapshot: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => AttemptAnswerOrmEntity, (answer) => answer.attempt)
  answers: AttemptAnswerOrmEntity[];
}
