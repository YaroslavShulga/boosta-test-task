"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AttemptProgress, Gender } from "@/lib/api/types";
import { completeAttempt, getCurrentQuiz, getInProgressAttempt, saveAnswer, startAttempt } from "./api";

export const quizKeys = {
  current: ["quiz", "current"] as const,
  inProgress: ["attempts", "in-progress"] as const,
};

export function useCurrentQuiz() {
  // Quiz versions are immutable, so the definition can be cached for the session.
  return useQuery({ queryKey: quizKeys.current, queryFn: getCurrentQuiz, staleTime: Infinity });
}

export function useInProgressAttempt() {
  return useQuery({ queryKey: quizKeys.inProgress, queryFn: getInProgressAttempt });
}

export function useStartAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gender: Gender) => startAttempt(gender),
    onSuccess: (attempt) => queryClient.setQueryData(quizKeys.inProgress, attempt),
  });
}

interface SaveAnswerVariables {
  attemptId: string;
  questionId: string;
  optionId: string;
}

/** Saves an answer, highlighting it immediately and rolling back if the request fails. */
export function useSaveAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, questionId, optionId }: SaveAnswerVariables) =>
      saveAnswer(attemptId, questionId, optionId),
    onMutate: async ({ questionId, optionId }) => {
      await queryClient.cancelQueries({ queryKey: quizKeys.inProgress });
      const previous = queryClient.getQueryData<AttemptProgress | null>(quizKeys.inProgress);
      if (previous) {
        queryClient.setQueryData<AttemptProgress>(quizKeys.inProgress, {
          ...previous,
          answers: [...previous.answers.filter((answer) => answer.questionId !== questionId), { questionId, optionId }],
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(quizKeys.inProgress, context?.previous ?? null);
    },
    onSuccess: (attempt) => queryClient.setQueryData(quizKeys.inProgress, attempt),
  });
}

export function useCompleteAttempt() {
  return useMutation({ mutationFn: (attemptId: string) => completeAttempt(attemptId) });
}
