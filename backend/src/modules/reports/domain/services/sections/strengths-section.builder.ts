import { Injectable } from '@nestjs/common';
import { ReportSectionType } from '../../../reports.constants';
import type { ReportContext } from '../../interfaces/report-context.interface';
import type { ReportSectionBuilder } from '../../interfaces/report-section-builder.interface';
import type { ChecklistReportSection } from '../../interfaces/report-section.interface';

@Injectable()
export class StrengthsSectionBuilder implements ReportSectionBuilder {
  build({ content }: ReportContext): ChecklistReportSection {
    return {
      type: ReportSectionType.Checklist,
      key: 'strengths',
      title: 'Your Cognitive and Behavioral Strengths',
      intro: content.strengths.intro,
      items: content.strengths.items
    };
  }
}
