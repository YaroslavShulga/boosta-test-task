import type { Gender } from '../../../attempts/attempts.constants';
import type { TraitLevel } from '../../../quizzes/quizzes.constants';
import type { ReportContent } from './report-content.interface';
import type { ReportSectionBuilder } from './report-section-builder.interface';

/** A report layout. Quiz versions reference a template by `key`. */
export interface ReportTemplate {
  readonly key: string;
  resolveContent(level: TraitLevel, gender: Gender): ReportContent;
  /** In display order. */
  readonly sections: ReportSectionBuilder[];
}
