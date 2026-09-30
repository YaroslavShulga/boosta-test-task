import { apiFetch, jsonBody } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import type { AttemptProgress, CompletedAttempt, Gender, Quiz } from "@/lib/api/types";

export const getCurrentQuiz = () => apiFetch<Quiz>("/quizzes/current");

/** The visitor's unfinished attempt, or `null` when there is none. */
export async function getInProgressAttempt(): Promise<AttemptProgress | null> {
  try {
    return await apiFetch<AttemptProgress>("/attempts/in-progress");
  } catch (error) {
    if (isApiError(error, "ATTEMPT_NOT_FOUND")) {
      return null;
    }
    throw error;
  }
}

export const startAttempt = (gender: Gender) =>
  apiFetch<AttemptProgress>("/attempts", { method: "POST", body: jsonBody({ gender }) });

export const saveAnswer = (attemptId: string, questionId: string, optionId: string) =>
  apiFetch<AttemptProgress>(`/attempts/${attemptId}/answers/${questionId}`, {
    method: "PUT",
    body: jsonBody({ optionId }),
  });

export const completeAttempt = (attemptId: string) =>
  apiFetch<CompletedAttempt>(`/attempts/${attemptId}/complete`, { method: "POST" });
