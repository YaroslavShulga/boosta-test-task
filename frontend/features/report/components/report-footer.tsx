import { Logo } from "@/components/logo";

export function ReportFooter() {
  return (
    <footer className="rounded-t-2xl bg-navy px-6 py-8 sm:rounded-t-3xl sm:px-10">
      <Logo href="/report" inverted />
      <p className="mt-3 text-sm text-white/70">All rights reserved 2026</p>
    </footer>
  );
}
