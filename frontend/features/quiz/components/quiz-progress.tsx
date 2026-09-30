interface QuizProgressProps {
  step: number;
  total: number;
}

export function QuizProgress({ step, total }: QuizProgressProps) {
  const percent = Math.round((step / total) * 100);
  return (
    <div
      role="progressbar"
      aria-label="Quiz progress"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-valuetext={`Question ${step} of ${total}`}
      className="h-1 w-full overflow-hidden rounded-full bg-surface"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand to-sky-500 transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
