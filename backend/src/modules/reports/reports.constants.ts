export const REPORT_TEMPLATES = Symbol('REPORT_TEMPLATES');

export const REPORT_MAX_SCORE = 100;

export enum ReportSectionType {
  Score = 'score',
  Text = 'text',
  Checklist = 'checklist',
  Faq = 'faq'
}

export enum TextBlockType {
  Paragraph = 'paragraph',
  List = 'list'
}
