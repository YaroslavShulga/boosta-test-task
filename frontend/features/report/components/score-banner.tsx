import type { ScoreSection } from "@/lib/api/types";
import { ScoreGauge } from "./score-gauge";

export function ScoreBanner({ section }: { section: ScoreSection }) {
  return (
    <section
      aria-labelledby="score-title"
      className="relative overflow-hidden rounded-2xl bg-surface px-6 py-8 sm:rounded-3xl sm:px-12 sm:py-10"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brand-soft blur-3xl" />
      <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h1 id="score-title" className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {section.title}
          </h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground sm:text-xl">{section.levelLabel}</p>
        </div>
        <ScoreGauge score={section.score} maxScore={section.maxScore} />
      </div>
    </section>
  );
}
