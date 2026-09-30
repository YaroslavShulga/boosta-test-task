import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back! Let's continue your learning journey"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/" className="font-medium text-brand underline-offset-4 hover:underline">
            Take the test and create one
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-in" />
    </AuthCard>
  );
}
