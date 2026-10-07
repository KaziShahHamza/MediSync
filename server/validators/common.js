// server/validators/common.js

// Provides reusable Zod validation rules shared across API schemas.

import { z } from "zod";

export const optionalText = (max, message = `Maximum ${max} characters.`) =>
  z.string().trim().max(max, { message });

export const requiredText = (
  max,
  requiredMessage = "This field is required.",
  maxMessage = `Maximum ${max} characters.`,
) =>
  z
    .string()
    .trim()
    .min(1, { message: requiredMessage })
    .max(max, { message: maxMessage });

export const emailSchema = z
  .string()
  .trim()
  .max(254, { message: "Email address is too long." })
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: "Please provide a valid email address.",
  });

export const phoneSchema = z
  .string()
  .trim()
  .max(30, { message: "Phone number is too long." })
  .refine((value) => !value || /^[0-9]+$/.test(value), {
    message: "Please provide a valid phone number.",
  });

export function isValidDate(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export function isFutureDate(value) {
  return new Date(value).getTime() > Date.now();
}
