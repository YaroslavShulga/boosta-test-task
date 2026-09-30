import { Logo } from "@/components/logo";

export default function FunnelLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-8">
      <header className="flex h-20 shrink-0 items-center sm:h-24">
        <Logo />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
