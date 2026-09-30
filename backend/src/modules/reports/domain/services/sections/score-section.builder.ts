import { Injectable } from '@nestjs/common';
import { REPORT_MAX_SCORE, ReportSectionType } from '../../../reports.constants';
import type { ReportContext } from '../../interfaces/report-context.interface';
import type { ReportSectionBuilder } from '../../interfaces/report-section-builder.interface';
import type { ScoreReportSection } from '../../interfaces/report-section.interface';

@Injectable()
export class ScoreSectionBuilder implements ReportSectionBuilder {
  build({ attempt, content }: ReportContext): ScoreReportSection | null {
    if (attempt.score === null || attempt.level === null) {
      return null;
    }
    return {
      type: ReportSectionType.Score,
      key: 'score',
      title: 'Your ADHD score',
      levelLabel: content.levelLabel,
      level: attempt.level,
      score: attempt.score,
      maxScore: REPORT_MAX_SCORE
    };
  }
}
