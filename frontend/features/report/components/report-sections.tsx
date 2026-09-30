import type { ReportSection } from "@/lib/api/types";
import { ChecklistSection } from "./checklist-section";
import { FaqSection } from "./faq-section";
import { ScoreBanner } from "./score-banner";
import { TextSection } from "./text-section";

/** Text sections shown with the blue accent bar. Presentation only; content comes from the backend. */
const ACCENTED_SECTION_KEYS = new Set(["understanding"]);

/**
 * Renders the backend-composed sections in order. A new section type needs a new
 * renderer here; new sections of existing types need no frontend change.
 */
export function ReportSections({ sections }: { sections: ReportSection[] }) {
  return sections.map((section) => {
    switch (section.type) {
      case "score":
        return <ScoreBanner key={section.key} section={section} />;
      case "text":
        return <TextSection key={section.key} section={section} accent={ACCENTED_SECTION_KEYS.has(section.key)} />;
      case "checklist":
        return <ChecklistSection key={section.key} section={section} />;
      case "faq":
        return <FaqSection key={section.key} section={section} />;
      default:
        // Unknown (newer) section types are skipped instead of breaking the page.
        return null;
    }
  });
}
