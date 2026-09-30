import { Check } from "lucide-react";
import type { ChecklistSection as ChecklistSectionData } from "@/lib/api/types";

export function ChecklistSection({ section }: { section: ChecklistSectionData }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">{section.title}</h2>
      {section.intro && <p className="mt-2 text-base text-muted-foreground">{section.intro}</p>}
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-border/70 bg-white p-4 text-base text-navy/85 shadow-xs transition-shadow hover:shadow-sm"
          >
            <span aria-hidden className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
