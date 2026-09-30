import { Injectable } from '@nestjs/common';
import { Gender } from '../../../../attempts/attempts.constants';
import { TraitLevel } from '../../../../quizzes/quizzes.constants';
import { HIGH_TRAITS_FEMALE, HIGH_TRAITS_MALE } from '../../content/adhd-v1/high-traits.content';
import { LOW_TRAITS_FEMALE, LOW_TRAITS_MALE } from '../../content/adhd-v1/low-traits.content';
import type { ReportContent } from '../../interfaces/report-content.interface';
import type { ReportSectionBuilder } from '../../interfaces/report-section-builder.interface';
import type { ReportTemplate } from '../../interfaces/report-template.interface';
import { EmotionalSectionBuilder } from '../sections/emotional-section.builder';
import { FaqSectionBuilder } from '../sections/faq-section.builder';
import { ScoreSectionBuilder } from '../sections/score-section.builder';
import { StrengthsSectionBuilder } from '../sections/strengths-section.builder';
import { UnderstandingSectionBuilder } from '../sections/understanding-section.builder';

const CONTENT: Record<TraitLevel, Record<Gender, ReportContent>> = {
  [TraitLevel.High]: {
    [Gender.Male]: HIGH_TRAITS_MALE,
    [Gender.Female]: HIGH_TRAITS_FEMALE
  },
  [TraitLevel.Low]: {
    [Gender.Male]: LOW_TRAITS_MALE,
    [Gender.Female]: LOW_TRAITS_FEMALE
  }
};

/** The report for ADHD quiz v1: 4 variants (level × gender) sharing one layout. */
@Injectable()
export class AdhdV1ReportTemplate implements ReportTemplate {
  static readonly KEY = 'adhd-v1';
  readonly key = AdhdV1ReportTemplate.KEY;
  readonly sections: ReportSectionBuilder[];

  constructor(
    score: ScoreSectionBuilder,
    understanding: UnderstandingSectionBuilder,
    strengths: StrengthsSectionBuilder,
    emotional: EmotionalSectionBuilder,
    faq: FaqSectionBuilder
  ) {
    this.sections = [score, understanding, strengths, emotional, faq];
  }

  resolveContent(level: TraitLevel, gender: Gender): ReportContent {
    return CONTENT[level][gender];
  }
}
