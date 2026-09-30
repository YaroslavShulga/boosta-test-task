// Types mirroring the backend API responses (see backend `resources/responses/`).

export type Gender = "male" | "female";
export type Level = "high" | "low";

export type ErrorCode =
  | "VALIDATION_FAILED"
  | "EMAIL_TAKEN"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "QUIZ_NOT_FOUND"
  | "ATTEMPT_NOT_FOUND"
  | "ATTEMPT_NOT_IN_PROGRESS"
  | "ATTEMPT_INCOMPLETE"
  | "INVALID_QUESTION"
  | "INVALID_OPTION"
  | "NO_COMPLETED_ATTEMPT"
  | "REPORT_NOT_FOUND"
  | "REPORT_TEMPLATE_NOT_FOUND";

export interface ApiErrorBody {
  statusCode: number;
  code?: ErrorCode | string;
  message?: string | string[];
}

export interface QuizOption {
  id: string;
  key: string;
  position: number;
  label: string;
}

export interface QuizQuestion {
  id: string;
  key: string;
  position: number;
  text: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  quizKey: string;
  version: number;
  questions: QuizQuestion[];
}

export interface AttemptAnswer {
  questionId: string;
  optionId: string;
}

export interface AttemptProgress {
  id: string;
  quizVersionId: string;
  gender: Gender;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  answers: AttemptAnswer[];
  totalQuestions: number;
  answeredQuestions: number;
  nextQuestionId: string | null;
}

export interface CompletedAttempt {
  id: string;
  status: "completed";
  completedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface Me extends AuthUser {
  hasCompletedAttempt: boolean;
}

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ListBlock {
  type: "list";
  items: string[];
}

export type TextBlock = ParagraphBlock | ListBlock;

export interface ScoreSection {
  type: "score";
  key: string;
  title: string;
  levelLabel: string;
  level: Level;
  score: number;
  maxScore: number;
}

export interface TextSection {
  type: "text";
  key: string;
  title: string;
  blocks: TextBlock[];
}

export interface ChecklistSection {
  type: "checklist";
  key: string;
  title: string;
  intro: string | null;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  type: "faq";
  key: string;
  title: string;
  items: FaqItem[];
}

export type ReportSection = ScoreSection | TextSection | ChecklistSection | FaqSection;

export interface Report {
  attemptId: string;
  quizVersionId: string;
  completedAt: string;
  score: number;
  level: Level;
  gender: Gender;
  sections: ReportSection[];
}
