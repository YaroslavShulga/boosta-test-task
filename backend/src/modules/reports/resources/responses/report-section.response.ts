import { Expose, Type } from 'class-transformer';
import { ReportSectionType, TextBlockType } from '../../reports.constants';

// Item responses composed by GetReportResponse. `type` is the discriminator
// the frontend switches on to render each section / text block.

export class ParagraphTextBlockResponse {
  @Expose()
  type: TextBlockType.Paragraph;

  @Expose()
  text: string;
}

export class ListTextBlockResponse {
  @Expose()
  type: TextBlockType.List;

  @Expose()
  items: string[];
}

export class ScoreReportSectionResponse {
  @Expose()
  type: ReportSectionType.Score;

  @Expose()
  key: string;

  @Expose()
  title: string;

  @Expose()
  levelLabel: string;

  @Expose()
  level: string;

  @Expose()
  score: number;

  @Expose()
  maxScore: number;
}

export class TextReportSectionResponse {
  @Expose()
  type: ReportSectionType.Text;

  @Expose()
  key: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => ParagraphTextBlockResponse, {
    discriminator: {
      property: 'type',
      subTypes: [
        { name: TextBlockType.Paragraph, value: ParagraphTextBlockResponse },
        { name: TextBlockType.List, value: ListTextBlockResponse }
      ]
    },
    keepDiscriminatorProperty: true
  })
  blocks: (ParagraphTextBlockResponse | ListTextBlockResponse)[];
}

export class ChecklistReportSectionResponse {
  @Expose()
  type: ReportSectionType.Checklist;

  @Expose()
  key: string;

  @Expose()
  title: string;

  @Expose()
  intro: string | null;

  @Expose()
  items: string[];
}

export class FaqItemResponse {
  @Expose()
  question: string;

  @Expose()
  answer: string;
}

export class FaqReportSectionResponse {
  @Expose()
  type: ReportSectionType.Faq;

  @Expose()
  key: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => FaqItemResponse)
  items: FaqItemResponse[];
}

export type ReportSectionResponse =
  ScoreReportSectionResponse | TextReportSectionResponse | ChecklistReportSectionResponse | FaqReportSectionResponse;
