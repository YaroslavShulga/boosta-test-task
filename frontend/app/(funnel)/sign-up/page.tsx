import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = { title: "Discover your ADHD Profile" };

export default function SignUpPage() {
  return (
    <AuthCard
      title={
        <>
          Discover your <span className="text-brand">ADHD</span> Profile
        </>
      }
      subtitle="Enter your email and password to access your full report"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-brand underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-up" />
    </AuthCard>
  );
}
