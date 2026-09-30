import { Module } from '@nestjs/common';
import { AttemptsModule } from '../attempts/attempts.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { ReportTemplateRegistry } from './domain/services/report-template-registry.service';
import { ReportsService } from './domain/services/reports.service';
import { EmotionalSectionBuilder } from './domain/services/sections/emotional-section.builder';
import { FaqSectionBuilder } from './domain/services/sections/faq-section.builder';
import { ScoreSectionBuilder } from './domain/services/sections/score-section.builder';
import { StrengthsSectionBuilder } from './domain/services/sections/strengths-section.builder';
import { UnderstandingSectionBuilder } from './domain/services/sections/understanding-section.builder';
import { AdhdV1ReportTemplate } from './domain/services/templates/adhd-v1.report-template';
import { REPORT_TEMPLATES } from './reports.constants';
import { ReportsController } from './resources/controllers/reports.controller';

@Module({
  imports: [AttemptsModule, QuizzesModule],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportTemplateRegistry,
    ScoreSectionBuilder,
    UnderstandingSectionBuilder,
    StrengthsSectionBuilder,
    EmotionalSectionBuilder,
    FaqSectionBuilder,
    AdhdV1ReportTemplate,
    {
      // Register new report templates here; quiz versions select one by key.
      provide: REPORT_TEMPLATES,
      useFactory: (adhdV1: AdhdV1ReportTemplate) => [adhdV1],
      inject: [AdhdV1ReportTemplate]
    }
  ]
})
export class ReportsModule {}
