import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizStep } from "@/features/quiz/components/quiz-step";

export const metadata: Metadata = { title: "ADHD Test" };

export default async function QuizStepPage({ params }: PageProps<"/quiz/[step]">) {
  const { step } = await params;
  const stepNumber = Number(step);
  if (!Number.isInteger(stepNumber) || stepNumber < 1) {
    notFound();
  }
  // The upper bound depends on the quiz version, so QuizStep clamps it on the client.
  return <QuizStep step={stepNumber} />;
}
