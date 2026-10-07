// server/validators/profilePhoto.schema.js

// Validates profile photo metadata before it is stored on the user account.

import { z } from "zod";

export const profilePhotoSchema = z
  .object({
    profilePhotoUrl: z
      .string()
      .trim()
      .min(1, {
        message: "Profile photo URL is required.",
      })
      .max(2048, {
        message: "Profile photo URL is too long.",
      })
      .refine(
        (value) => {
          try {
            const url = new URL(value);

            return url.protocol === "https:" && Boolean(url.hostname);
          } catch {
            return false;
          }
        },
        {
          message: "Please provide a valid secure profile photo URL.",
        },
      ),

    profilePhotoPublicId: z
      .string()
      .trim()
      .min(1, {
        message: "Profile photo public ID is required.",
      })
      .max(500, {
        message: "Profile photo public ID is too long.",
      }),
  })
  .strict();
