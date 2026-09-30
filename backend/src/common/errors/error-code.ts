/** Stable, machine-readable error codes returned in the `code` field of error responses. */
export enum ErrorCode {
  ValidationFailed = 'VALIDATION_FAILED',
  EmailTaken = 'EMAIL_TAKEN',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  Unauthorized = 'UNAUTHORIZED',
  QuizNotFound = 'QUIZ_NOT_FOUND',
  AttemptNotFound = 'ATTEMPT_NOT_FOUND',
  AttemptNotInProgress = 'ATTEMPT_NOT_IN_PROGRESS',
  AttemptIncomplete = 'ATTEMPT_INCOMPLETE',
  InvalidQuestion = 'INVALID_QUESTION',
  InvalidOption = 'INVALID_OPTION',
  NoCompletedAttempt = 'NO_COMPLETED_ATTEMPT',
  ReportNotFound = 'REPORT_NOT_FOUND',
  ReportTemplateNotFound = 'REPORT_TEMPLATE_NOT_FOUND'
}
