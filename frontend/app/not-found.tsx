import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-8">
      <header className="flex h-20 items-center sm:h-24">
        <Logo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 pb-24 text-center">
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">404</p>
        <h1 className="text-3xl font-bold text-navy">Page not found</h1>
        <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-2 h-11 rounded-xl px-5")}>
          Go to the test
        </Link>
      </main>
    </div>
  );
}
