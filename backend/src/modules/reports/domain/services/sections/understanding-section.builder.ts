import { Injectable } from '@nestjs/common';
import { ReportSectionType, TextBlockType } from '../../../reports.constants';
import type { ReportContext } from '../../interfaces/report-context.interface';
import type { ReportSectionBuilder } from '../../interfaces/report-section-builder.interface';
import type { TextReportSection } from '../../interfaces/report-section.interface';

@Injectable()
export class UnderstandingSectionBuilder implements ReportSectionBuilder {
  build({ content }: ReportContext): TextReportSection {
    return {
      type: ReportSectionType.Text,
      key: 'understanding',
      title: 'Understanding Your Score',
      blocks: content.understanding.map((text) => ({
        type: TextBlockType.Paragraph,
        text
      }))
    };
  }
}
