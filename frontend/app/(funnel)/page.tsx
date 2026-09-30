import { Info } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GenderStart } from "@/features/quiz/components/gender-start";
import { HeroIllustration } from "@/features/quiz/components/hero-illustration";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies";

export default async function GetReadyPage({ searchParams }: PageProps<"/">) {
  const [{ notice }, cookieStore] = await Promise.all([searchParams, cookies()]);
  const signedIn = cookieStore.has(ACCESS_TOKEN_COOKIE);

  return (
    <div className="flex flex-1 flex-col items-center pb-12">
      {notice === "no-result" && (
        <Alert className="mb-6 max-w-2xl rounded-xl border-brand/20 bg-brand-soft/60 px-4 py-3 text-navy animate-in fade-in-0">
          <Info className="text-brand" />
          <AlertDescription className="text-navy/80">
            You haven&apos;t completed the test yet. Choose your gender below to take it and get your report.
          </AlertDescription>
        </Alert>
      )}

      <section className="w-full max-w-2xl rounded-3xl border border-border/70 bg-white px-5 py-8 shadow-xl shadow-navy/5 animate-in fade-in-0 slide-in-from-bottom-3 duration-500 sm:px-10 sm:py-10">
        <HeroIllustration />

        <div className="mt-8 flex flex-col items-center text-center">
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-navy sm:text-5xl">
            Discover Your
            <br />
            <span className="bg-gradient-to-r from-brand to-sky-500 bg-clip-text text-transparent">
              ADHD Trait Profile
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            Find out how ADHD traits influence your focus, energy, and daily life
          </p>
          <div className="mt-8 flex w-full justify-center">
            <GenderStart />
          </div>
        </div>
      </section>

      <p className="mt-6 text-sm text-muted-foreground">
        {signedIn ? (
          <Link href="/report" className="font-medium text-brand underline-offset-4 hover:underline">
            View my latest report
          </Link>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-brand underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
