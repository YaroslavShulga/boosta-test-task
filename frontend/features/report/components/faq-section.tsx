"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqSection as FaqSectionData } from "@/lib/api/types";

export function FaqSection({ section }: { section: FaqSectionData }) {
  return (
    <section aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-center text-xl font-semibold tracking-tight text-navy sm:text-2xl">
        {section.title}
      </h2>
      {/* The first question is expanded by default, as in the mockups. */}
      <Accordion defaultValue={["faq-0"]} multiple className="mt-6 rounded-2xl border border-border/70 bg-white px-5 shadow-xs sm:px-6">
        {section.items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="py-4 text-base font-semibold text-navy hover:no-underline sm:py-5 **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:rounded-full **:data-[slot=accordion-trigger-icon]:border **:data-[slot=accordion-trigger-icon]:p-0.5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
