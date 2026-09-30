import type { FaqItem } from './report-section.interface';

/** The copy of one report variant (level × gender). */
export interface ReportContent {
  levelLabel: string;
  understanding: string[];
  strengths: {
    intro: string | null;
    items: string[];
  };
  emotional: {
    intro: string;
    bullets: string[];
    closing: string | null;
  };
  faq: FaqItem[];
}
