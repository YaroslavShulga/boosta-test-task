import { Logo } from "@/components/logo";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { ReportFooter } from "@/features/report/components/report-footer";

export default function ReportLayout({ children }: LayoutProps<"/report">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-8">
      <header className="flex h-20 shrink-0 items-center justify-between sm:h-24">
        <Logo href="/report" />
        <SignOutButton />
      </header>
      <main className="flex flex-1 flex-col pb-16">{children}</main>
      <ReportFooter />
    </div>
  );
}
