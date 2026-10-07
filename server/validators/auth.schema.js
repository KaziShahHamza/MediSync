// Defines request schemas for authentication endpoints.

import { z } from "zod";

import { emailSchema, requiredText } from "./common.js";

const usernameSchema = requiredText(
  254,
  "Username is required.",
  "Username cannot exceed 254 characters.",
);

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." });

const signupEmailSchema = emailSchema
  .min(1, { message: "Email is required." })
  .transform((value) => value.toLowerCase());

export const signupSchema = z.strictObject({
  name: requiredText(
    50,
    "Name is required.",
    "Name cannot exceed 50 characters.",
  ),
  username: usernameSchema,
  email: signupEmailSchema,
  password: passwordSchema,
});

export const loginSchema = z.strictObject({
  identifier: requiredText(
    254,
    "Username or email is required.",
    "Username or email cannot exceed 254 characters.",
  )
    .refine(
      (value) =>
        !value.includes("@") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: "Please provide a valid email address." },
    )
    .transform((value) => (value.includes("@") ? value.toLowerCase() : value)),
  password: z.string().min(1, { message: "Password is required." }),
});
