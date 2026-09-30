import { Injectable } from '@nestjs/common';
import { ReportSectionType, TextBlockType } from '../../../reports.constants';
import type { ReportContext } from '../../interfaces/report-context.interface';
import type { ReportSectionBuilder } from '../../interfaces/report-section-builder.interface';
import type { TextBlock, TextReportSection } from '../../interfaces/report-section.interface';

/** High variants: intro, bullets and a closing paragraph. Low variants: a paragraph only. */
@Injectable()
export class EmotionalSectionBuilder implements ReportSectionBuilder {
  build({ content }: ReportContext): TextReportSection {
    const { intro, bullets, closing } = content.emotional;
    const blocks: TextBlock[] = [{ type: TextBlockType.Paragraph, text: intro }];
    if (bullets.length > 0) {
      blocks.push({ type: TextBlockType.List, items: bullets });
    }
    if (closing) {
      blocks.push({ type: TextBlockType.Paragraph, text: closing });
    }
    return {
      type: ReportSectionType.Text,
      key: 'emotional-regulation',
      title: 'Your Emotional Regulation and Impulse Control',
      blocks
    };
  }
}
