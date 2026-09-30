import type { TextSection as TextSectionData } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface TextSectionProps {
  section: TextSectionData;
  /** Highlighted with a blue accent bar (used for "Understanding Your Score"). */
  accent?: boolean;
}

export function TextSection({ section, accent = false }: TextSectionProps) {
  return (
    <section className={cn(accent && "border-l-4 border-brand pl-5 sm:pl-6")}>
      <h2 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">{section.title}</h2>
      <div className="mt-3 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
        {section.blocks.map((block, index) =>
          block.type === "paragraph" ? (
            <p key={index} className="last:not-first:font-medium last:not-first:text-navy/80">
              {block.text}
            </p>
          ) : (
            <ul key={index} className="flex flex-col gap-2.5">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ),
        )}
      </div>
    </section>
  );
}
