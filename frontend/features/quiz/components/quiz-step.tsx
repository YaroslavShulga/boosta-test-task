"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getMe } from "@/features/auth/api";
import { errorMessage } from "@/lib/api/errors";
import { quizKeys, useCompleteAttempt, useCurrentQuiz, useInProgressAttempt, useSaveAnswer } from "../hooks";
import { furthestAllowedStep, isResumable, orderedQuestions } from "../quiz-state";
import { AnswerOption } from "./answer-option";
import { QuizNav } from "./quiz-nav";
import { QuizProgress } from "./quiz-progress";

/** Short pause so the user sees the highlighted answer before the next question appears. */
const ADVANCE_DELAY_MS = 350;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function QuizStep({ step }: { step: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const quiz = useCurrentQuiz();
  const inProgress = useInProgressAttempt();
  const saveAnswer = useSaveAnswer();
  const complete = useCompleteAttempt();
  const [advancing, setAdvancing] = useState(false);
  // While completing, the "no attempt" guard below must not redirect to the start.
  const [finishing, setFinishing] = useState(false);

  const questions = quiz.data ? orderedQuestions(quiz.data) : [];
  const attempt = quiz.data && isResumable(quiz.data, inProgress.data) ? inProgress.data : null;
  const total = questions.length;
  const question = questions[step - 1];
  const selectedOptionId = attempt?.answers.find((answer) => answer.questionId === question?.id)?.optionId;

  // Guards: no attempt → Get ready; out-of-range or skipped-ahead step → furthest allowed step.
  const loaded = quiz.isSuccess && inProgress.isSuccess;
  const allowedStep = attempt ? furthestAllowedStep(questions, attempt) : 1;
  const redirectTo = !loaded || finishing ? null : !attempt ? "/" : step > allowedStep ? `/quiz/${allowedStep}` : null;

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  useEffect(() => {
    if (quiz.isError || inProgress.isError) {
      toast.error(errorMessage(quiz.error ?? inProgress.error));
    }
  }, [quiz.isError, inProgress.isError, quiz.error, inProgress.error]);

  const finish = async (attemptId: string) => {
    setFinishing(true);
    try {
      await complete.mutateAsync(attemptId);
      const me = await getMe();
      queryClient.setQueryData(quizKeys.inProgress, null);
      // A signed-in user (retake) goes straight to the report; anonymous users create an account.
      router.replace(me ? "/report" : "/sign-up");
      router.refresh();
    } catch (error) {
      setFinishing(false);
      toast.error(errorMessage(error));
    }
  };

  const goForward = () => {
    if (!attempt) return;
    if (step < total) {
      router.push(`/quiz/${step + 1}`);
    } else {
      void finish(attempt.id);
    }
  };

  const handleSelect = async (optionId: string) => {
    if (!attempt || !question || advancing) return;
    setAdvancing(true);
    try {
      await Promise.all([
        saveAnswer.mutateAsync({ attemptId: attempt.id, questionId: question.id, optionId }),
        delay(ADVANCE_DELAY_MS),
      ]);
    } catch (error) {
      setAdvancing(false);
      toast.error(errorMessage(error));
      return;
    }
    setAdvancing(false);
    goForward();
  };

  const goBack = () => router.push(step === 1 ? "/" : `/quiz/${step - 1}`);

  if (finishing && !attempt) {
    return <FinishingOverlay />;
  }
  if (!loaded || redirectTo || !question || !attempt) {
    return <QuizStepSkeleton />;
  }

  const busy = advancing || finishing;

  return (
    <div className="flex flex-1 flex-col">
      <QuizProgress step={step} total={total} />

      <div
        key={question.id}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col pt-10 animate-in fade-in-0 slide-in-from-right-6 duration-300 sm:pt-12"
      >
        <h1
          id="question-title"
          className="mx-auto max-w-2xl text-center text-2xl font-semibold tracking-tight text-balance text-navy sm:text-3xl"
        >
          {question.text}
        </h1>

        <div role="radiogroup" aria-labelledby="question-title" className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-4">
          {question.options
            .toSorted((a, b) => a.position - b.position)
            .map((option) => (
              <AnswerOption
                key={option.id}
                label={option.label}
                selected={option.id === selectedOptionId}
                disabled={busy}
                onSelect={() => void handleSelect(option.id)}
              />
            ))}
        </div>

        <div className="mt-auto pt-10 pb-8">
          <QuizNav
            step={step}
            total={total}
            canGoForward={!!selectedOptionId}
            busy={busy}
            onBack={goBack}
            onForward={goForward}
          />
        </div>
      </div>

      {finishing && <FinishingOverlay />}
    </div>
  );
}

function FinishingOverlay() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm animate-in fade-in-0"
    >
      <Loader2 className="size-10 animate-spin text-brand" />
      <p className="text-lg font-medium text-navy">Calculating your results…</p>
    </div>
  );
}

function QuizStepSkeleton() {
  return (
    <div className="flex flex-1 flex-col" aria-busy>
      <Skeleton className="h-1 w-full" />
      <div className="mx-auto w-full max-w-3xl pt-12">
        <Skeleton className="mx-auto h-8 w-3/4" />
        <Skeleton className="mx-auto mt-3 h-8 w-1/2" />
        <div className="mt-10 flex flex-col gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
