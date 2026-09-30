import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Decorative only: a dotted head silhouette with four static chips (not data).

const HEAD_PATH =
  "M70 232C70 204 61 188 54 172C40 150 35 121 40 95C48 50 86 20 126 25C160 30 181 60 179 92C178 105 183 112 190 122C194 128 191 132 184 133C182 140 184 146 180 150C183 155 181 160 176 162C178 172 174 180 162 180C150 180 143 183 141 196L139 232Z";

function Chip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "absolute rounded-xl border border-border/70 bg-white/85 px-3 py-2 text-sm leading-tight text-navy/80 shadow-sm backdrop-blur-sm sm:text-base",
        "animate-in fade-in-0 zoom-in-95 duration-700 fill-mode-both",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HeroIllustration() {
  return (
    <div aria-hidden className="relative mx-auto h-56 w-full max-w-md sm:h-64">
      <div className="absolute inset-x-10 inset-y-4 rounded-full bg-brand-soft/60 blur-3xl" />
      <svg viewBox="0 0 220 240" className="relative mx-auto h-full">
        <defs>
          <pattern id="head-dots" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.1" fill="var(--brand)" />
          </pattern>
          <linearGradient id="head-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="head-mask">
            <path d={HEAD_PATH} fill="url(#head-fade)" />
          </mask>
        </defs>
        <rect width="220" height="240" fill="url(#head-dots)" mask="url(#head-mask)" />
      </svg>

      <Chip className="top-4 left-0 delay-150 sm:left-2">
        <span className="text-brand">High</span>
        <br />
        Productivity
      </Chip>
      <Chip className="top-0 right-0 delay-300">
        <TrendingUp className="mr-1 inline size-4 text-brand" />
        <span className="text-brand">+10%</span> Impulsivity
      </Chip>
      <Chip className="bottom-12 left-2 delay-500 sm:left-6">
        <TrendingDown className="mr-1 inline size-4 text-brand" />
        <span className="text-brand">-6%</span> Focus
      </Chip>
      <Chip className="right-0 bottom-2 text-right delay-700">
        <span className="text-brand">Medium</span>
        <br />
        Distractions
      </Chip>
    </div>
  );
}
