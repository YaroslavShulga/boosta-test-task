import { Injectable } from '@nestjs/common';
import { ReportSectionType } from '../../../reports.constants';
import type { ReportContext } from '../../interfaces/report-context.interface';
import type { ReportSectionBuilder } from '../../interfaces/report-section-builder.interface';
import type { FaqReportSection } from '../../interfaces/report-section.interface';

@Injectable()
export class FaqSectionBuilder implements ReportSectionBuilder {
  build({ content }: ReportContext): FaqReportSection {
    return {
      type: ReportSectionType.Faq,
      key: 'faq',
      title: 'Frequently asked questions',
      items: content.faq
    };
  }
}
