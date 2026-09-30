import type { TraitLevel } from '../../../quizzes/quizzes.constants';
import type { ReportSectionType, TextBlockType } from '../../reports.constants';

// Section shapes are generic (score / text / checklist / faq) so the frontend
// renders any report by `type`. New sections reuse them or add a new type.

export interface ScoreReportSection {
  type: ReportSectionType.Score;
  key: string;
  title: string;
  levelLabel: string;
  level: TraitLevel;
  score: number;
  maxScore: number;
}

export interface ParagraphTextBlock {
  type: TextBlockType.Paragraph;
  text: string;
}

export interface ListTextBlock {
  type: TextBlockType.List;
  items: string[];
}

export type TextBlock = ParagraphTextBlock | ListTextBlock;

export interface TextReportSection {
  type: ReportSectionType.Text;
  key: string;
  title: string;
  blocks: TextBlock[];
}

export interface ChecklistReportSection {
  type: ReportSectionType.Checklist;
  key: string;
  title: string;
  intro: string | null;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqReportSection {
  type: ReportSectionType.Faq;
  key: string;
  title: string;
  items: FaqItem[];
}

export type ReportSection = ScoreReportSection | TextReportSection | ChecklistReportSection | FaqReportSection;
