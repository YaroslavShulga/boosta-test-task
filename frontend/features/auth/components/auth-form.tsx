"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage, isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { signIn, signUp } from "../api";
import { type AuthFormValues, signInSchema, signUpSchema } from "../schemas";

type AuthMode = "sign-up" | "sign-in";

const MODES = {
  "sign-up": {
    schema: signUpSchema,
    submit: signUp,
    submitLabel: "Get My Results",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Create Password",
    passwordAutoComplete: "new-password",
  },
  "sign-in": {
    schema: signInSchema,
    submit: signIn,
    submitLabel: "Sign in",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    passwordAutoComplete: "current-password",
  },
} as const;

export function AuthForm({ mode }: { mode: AuthMode }) {
  const config = MODES[mode];
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(config.schema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });
  const { errors } = form.formState;

  const mutation = useMutation({
    mutationFn: config.submit,
    onSuccess: () => {
      router.replace("/report");
      router.refresh();
    },
    onError: (error) => {
      if (isApiError(error, "EMAIL_TAKEN")) {
        setEmailTaken(true);
        form.setError("email", { message: error.message }, { shouldFocus: true });
        return;
      }
      if (isApiError(error, "INVALID_CREDENTIALS")) {
        form.setError("root", { message: "Incorrect email or password. Please try again." });
        form.resetField("password", { keepError: false });
        return;
      }
      form.setError("root", { message: errorMessage(error) });
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setEmailTaken(false);
    mutation.mutate(values);
  });

  const busy = mutation.isPending || mutation.isSuccess;

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-3">
      {errors.root?.message && (
        <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-1 rounded-xl border-destructive/30 bg-destructive/5 px-4 py-3">
          <AlertCircle />
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <Field id={`${mode}-email`} label="Email" error={errors.email?.message}>
        <Input
          id={`${mode}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={config.emailPlaceholder}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${mode}-email-error` : undefined}
          className={inputClassName}
          {...form.register("email")}
        />
      </Field>
      {emailTaken && (
        <p className="-mt-1 text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-brand underline-offset-4 hover:underline">
            Sign in to your account
          </Link>{" "}
          to see your results.
        </p>
      )}

      <Field id={`${mode}-password`} label="Password" error={errors.password?.message}>
        <div className="relative">
          <Input
            id={`${mode}-password`}
            type={showPassword ? "text" : "password"}
            autoComplete={config.passwordAutoComplete}
            placeholder={config.passwordPlaceholder}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? `${mode}-password-error` : undefined}
            className={cn(inputClassName, "pr-12")}
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-muted-foreground transition-colors outline-none hover:text-navy focus-visible:text-brand"
          >
            {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={busy}
        className="mt-2 h-13 rounded-xl text-base font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90"
      >
        {busy && <Loader2 className="animate-spin" />}
        {config.submitLabel}
      </Button>
    </form>
  );
}

const inputClassName =
  "h-13 rounded-xl border-input bg-surface/60 px-4 text-base transition-all focus-visible:bg-white focus-visible:ring-brand/20 md:text-base";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="px-1 text-sm text-destructive animate-in fade-in-0">
          {error}
        </p>
      )}
    </div>
  );
}
