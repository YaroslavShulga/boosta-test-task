import { RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ReportSections } from "@/features/report/components/report-sections";
import { serverFetch } from "@/lib/api/server";
import type { Report } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Your ADHD Report" };

export default async function ReportPage() {
  const result = await serverFetch<Report>("/reports/current");

  if (!result.ok) {
    const { error } = result;
    if (error.statusCode === 401) {
      // Stale/invalid session cookie: clear it in a route handler, then Sign in.
      redirect("/session/expired");
    }
    if (error.code === "NO_COMPLETED_ATTEMPT") {
      redirect("/?notice=no-result");
    }
    throw error;
  }

  const report = result.data;
  return (
    <div className="flex flex-col gap-12 animate-in fade-in-0 duration-500 sm:gap-14">
      <ReportSections sections={report.sections} />

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-8 text-center">
        <p className="text-base text-muted-foreground">Want to see how your traits change? Take the test again anytime.</p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-xl px-5 text-base")}>
          <RotateCcw />
          Retake test
        </Link>
      </div>
    </div>
  );
}
