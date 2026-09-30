"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

/** A full-width selectable card; part of the question's `radiogroup`. */
export function AnswerOption({ label, selected, disabled, onSelect }: AnswerOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left text-base font-medium text-navy transition-all duration-200 outline-none sm:py-5",
        "focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed",
        selected
          ? "border-brand bg-brand-soft shadow-md shadow-brand/10"
          : "border-transparent bg-surface hover:-translate-y-0.5 hover:border-brand/30 hover:bg-brand-soft/50 hover:shadow-sm",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          selected ? "scale-100 border-brand bg-brand text-white" : "scale-90 border-navy/15 text-transparent",
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}
