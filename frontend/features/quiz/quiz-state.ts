import type { AttemptProgress, Quiz, QuizQuestion } from "@/lib/api/types";

/** Questions in display order. */
export function orderedQuestions(quiz: Quiz): QuizQuestion[] {
  return [...quiz.questions].sort((a, b) => a.position - b.position);
}

/**
 * The furthest step (1-based) the user may open: the first unanswered question,
 * or the last question once everything is answered. Prevents skipping ahead.
 */
export function furthestAllowedStep(questions: QuizQuestion[], attempt: AttemptProgress): number {
  if (attempt.nextQuestionId === null) {
    return questions.length;
  }
  const index = questions.findIndex((question) => question.id === attempt.nextQuestionId);
  return index === -1 ? 1 : index + 1;
}

/** Whether the in-progress attempt can be continued on the quiz version currently served. */
export function isResumable(quiz: Quiz, attempt: AttemptProgress | null | undefined): attempt is AttemptProgress {
  return !!attempt && attempt.quizVersionId === quiz.id;
}
