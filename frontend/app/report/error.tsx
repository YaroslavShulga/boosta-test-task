"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ReportError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert />
      </span>
      <h1 className="text-2xl font-semibold text-navy">We couldn&apos;t load your report</h1>
      <p className="max-w-md text-muted-foreground">Something went wrong on our side. Please try again in a moment.</p>
      <Button size="lg" className="h-11 rounded-xl px-5" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
