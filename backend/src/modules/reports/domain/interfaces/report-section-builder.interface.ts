import type { ReportContext } from './report-context.interface';
import type { ReportSection } from './report-section.interface';

export interface ReportSectionBuilder {
  /** Returns null to leave the section out of this report. */
  build(context: ReportContext): ReportSection | null;
}
