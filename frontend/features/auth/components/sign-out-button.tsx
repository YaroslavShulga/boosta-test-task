"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/errors";
import { signOut } from "../api";

export function SignOutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/sign-in");
      router.refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Button
      variant="ghost"
      className="h-9 gap-1.5 rounded-lg px-3 text-sm text-navy"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending || mutation.isSuccess}
    >
      {mutation.isPending ? <Loader2 className="animate-spin" /> : <UserRound />}
      Sign out
    </Button>
  );
}
