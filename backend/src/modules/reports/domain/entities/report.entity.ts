import type { Gender } from '../../../attempts/attempts.constants';
import type { TraitLevel } from '../../../quizzes/quizzes.constants';
import type { ReportSection } from '../interfaces/report-section.interface';

/** A report composed on read from a completed attempt. Not persisted. */
export class Report {
  attemptId: string;
  quizVersionId: string;
  completedAt: Date;
  score: number;
  level: TraitLevel;
  gender: Gender;
  sections: ReportSection[];

  constructor(props: Partial<Report> = {}) {
    Object.assign(this, props);
  }
}
