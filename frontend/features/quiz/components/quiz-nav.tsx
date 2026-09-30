"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizNavProps {
  step: number;
  total: number;
  canGoForward: boolean;
  busy: boolean;
  onBack: () => void;
  onForward: () => void;
}

export function QuizNav({ step, total, canGoForward, busy, onBack, onForward }: QuizNavProps) {
  const isLast = step === total;
  return (
    <nav aria-label="Quiz navigation" className="flex items-center justify-between">
      <Button
        variant="secondary"
        size="icon-lg"
        className="size-11 rounded-xl"
        aria-label={step === 1 ? "Back to start" : "Previous question"}
        onClick={onBack}
        disabled={busy}
      >
        <ArrowLeft />
      </Button>
      <span className="text-base font-medium text-muted-foreground tabular-nums" aria-live="polite">
        {step}/{total}
      </span>
      <Button
        variant="secondary"
        size="icon-lg"
        className="size-11 rounded-xl"
        aria-label={isLast ? "See my results" : "Next question"}
        onClick={onForward}
        disabled={!canGoForward || busy}
      >
        {busy ? <Loader2 className="animate-spin" /> : <ArrowRight />}
      </Button>
    </nav>
  );
}
