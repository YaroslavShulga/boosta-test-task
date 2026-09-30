import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  inverted?: boolean;
  className?: string;
}

export function Logo({ href = "/", inverted = false, className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="BrainsMate home"
      className={cn("inline-flex items-center gap-1.5 rounded-md text-xl font-bold tracking-tight", className)}
    >
      <BrainCircuit className={cn("size-7", inverted ? "text-sky-300" : "text-brand")} strokeWidth={1.75} />
      <span className={inverted ? "text-white" : "text-navy"}>Brains</span>
      <span className={inverted ? "text-sky-300" : "text-brand"}>Mate</span>
    </Link>
  );
}
