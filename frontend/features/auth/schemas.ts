import { z } from "zod";

/** Mirrors the backend rules (PASSWORD_MIN_LENGTH = 8, max 128); the backend validates again. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

const email = z
  .string()
  .trim()
  .min(1, "Please enter your email.")
  .email("Please enter a valid email address.")
  .max(320, "Email is too long.");

export const signUpSchema = z.object({
  email,
  password: z
    .string()
    .min(1, "Please create a password.")
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`)
    .max(PASSWORD_MAX_LENGTH, "Password is too long."),
});

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Please enter your password."),
});

export type AuthFormValues = z.infer<typeof signUpSchema>;
