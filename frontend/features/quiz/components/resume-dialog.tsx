"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResumeDialogProps {
  open: boolean;
  answered: number;
  total: number;
  onContinue: () => void;
  /** Just closes the dialog: picking a gender then starts a new attempt (the old one is kept as abandoned). */
  onStartOver: () => void;
}

export function ResumeDialog({ open, answered, total, onContinue, onStartOver }: ResumeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onStartOver()}>
      <DialogContent showCloseButton={false} className="gap-5 rounded-2xl p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Welcome back!</DialogTitle>
          <DialogDescription>
            You&apos;ve already answered {answered} of {total} questions. Continue where you left off, or start over?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="-mx-6 -mb-6 rounded-b-2xl px-6 pb-6">
          <Button variant="outline" size="lg" className="h-11 px-5" onClick={onStartOver}>
            Start over
          </Button>
          <Button size="lg" className="h-11 px-5" onClick={onContinue} autoFocus>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
