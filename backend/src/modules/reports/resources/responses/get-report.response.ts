import { Expose, plainToInstance, Type } from 'class-transformer';
import { ReportSectionType } from '../../reports.constants';
import type { Report } from '../../domain/entities/report.entity';
import {
  ChecklistReportSectionResponse,
  FaqReportSectionResponse,
  type ReportSectionResponse,
  ScoreReportSectionResponse,
  TextReportSectionResponse
} from './report-section.response';

export class GetReportResponse {
  @Expose()
  attemptId: string;

  @Expose()
  quizVersionId: string;

  @Expose()
  completedAt: Date;

  @Expose()
  score: number;

  @Expose()
  level: string;

  @Expose()
  gender: string;

  @Expose()
  @Type(() => ScoreReportSectionResponse, {
    discriminator: {
      property: 'type',
      subTypes: [
        { name: ReportSectionType.Score, value: ScoreReportSectionResponse },
        { name: ReportSectionType.Text, value: TextReportSectionResponse },
        {
          name: ReportSectionType.Checklist,
          value: ChecklistReportSectionResponse
        },
        { name: ReportSectionType.Faq, value: FaqReportSectionResponse }
      ]
    },
    keepDiscriminatorProperty: true
  })
  sections: ReportSectionResponse[];

  static fromEntity(report: Report): GetReportResponse {
    return plainToInstance(GetReportResponse, report, {
      excludeExtraneousValues: true
    });
  }
}
