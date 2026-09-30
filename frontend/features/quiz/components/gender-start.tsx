"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/errors";
import type { Gender } from "@/lib/api/types";
import { useCurrentQuiz, useInProgressAttempt, useStartAttempt } from "../hooks";
import { furthestAllowedStep, isResumable, orderedQuestions } from "../quiz-state";
import { ResumeDialog } from "./resume-dialog";

const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export function GenderStart() {
  const router = useRouter();
  const quiz = useCurrentQuiz();
  const inProgress = useInProgressAttempt();
  const start = useStartAttempt();
  const [resumeDismissed, setResumeDismissed] = useState(false);

  const attempt = inProgress.data;
  const resumable = quiz.data && isResumable(quiz.data, attempt) && attempt.answeredQuestions > 0 ? attempt : null;

  const handleStart = (gender: Gender) => {
    start.mutate(gender, {
      onSuccess: () => router.push("/quiz/1"),
      onError: (error) => toast.error(errorMessage(error)),
    });
  };

  const handleContinue = () => {
    if (!quiz.data || !resumable) return;
    router.push(`/quiz/${furthestAllowedStep(orderedQuestions(quiz.data), resumable)}`);
  };

  return (
    <>
      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {GENDERS.map(({ value, label }) => {
          const pending = start.isPending && start.variables === value;
          return (
            <Button
              key={value}
              size="lg"
              className="h-14 rounded-xl text-base font-semibold shadow-sm shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
              disabled={start.isPending || quiz.isPending}
              onClick={() => handleStart(value)}
            >
              {pending && <Loader2 className="animate-spin" />}
              {label}
            </Button>
          );
        })}
      </div>

      {resumable && quiz.data && (
        <ResumeDialog
          open={!resumeDismissed}
          answered={resumable.answeredQuestions}
          total={resumable.totalQuestions}
          onContinue={handleContinue}
          onStartOver={() => setResumeDismissed(true)}
        />
      )}
    </>
  );
}
