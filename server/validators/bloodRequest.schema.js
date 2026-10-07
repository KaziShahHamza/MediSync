// server/validators/bloodRequest.schema.js

// Defines request schemas for blood request creation and updates.

import { z } from "zod";

import { BLOOD_GROUPS } from "../utils/blood/bloodRequestHelpers.js";
import { requiredText } from "./common.js";

const integerField = (min, max, message) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() !== "" ? Number(value) : value,
    z
      .number({ error: message })
      .int({ message })
      .min(min, { message })
      .max(max, { message }),
  );

const optionalText = (max, message) =>
  z.preprocess(
    (value) => (value === null || value === undefined ? "" : value),
    z.string().trim().max(max, { message }),
  );

const requiredRequestText = (max, requiredMessage, maxMessage) =>
  z.preprocess(
    (value) => (value === null || value === undefined ? "" : value),
    requiredText(max, requiredMessage, maxMessage),
  );

const phoneSchema = z.preprocess(
  (value) => (value === null || value === undefined ? "" : value),
  z
    .string()
    .trim()
    .min(1, { message: "Contact phone is required." })
    .max(30, { message: "Contact phone is too long." })
    .refine((value) => !value || /^[+]?[\d\s()-]{7,20}$/.test(value), {
      message: "Please provide a valid contact phone number.",
    }),
);

const transportFields = {
  deviceId: z
    .string()
    .trim()
    .max(100, { message: "Invalid device identifier." })
    .optional()
    .default(""),
  managementToken: z
    .string()
    .trim()
    .max(256, { message: "Invalid management token." })
    .optional()
    .default(""),
};

const bloodRequestFields = {
  bloodGroup: requiredRequestText(
    10,
    "Blood group is required.",
    "Please select a valid blood group.",
  ).refine((value) => !value || BLOOD_GROUPS.includes(value), {
    message: "Please select a valid blood group.",
  }),
  bagsNeeded: integerField(1, 20, "Number of bags must be between 1 and 20."),
  neededWithinDays: integerField(
    1,
    7,
    "Please select a valid timeframe between 1 and 7 days.",
  ),
  compensationOffered: z.boolean({
    error: "Please specify whether you will provide travel cost or honorarium.",
  }),
  district: requiredRequestText(
    100,
    "District is required.",
    "District is too long.",
  ),
  upazila: requiredRequestText(
    100,
    "Upazila is required.",
    "Upazila is too long.",
  ),
  hospitalName: requiredRequestText(
    200,
    "Hospital name is required.",
    "Hospital name is too long.",
  ),
  hospitalAddress: requiredRequestText(
    500,
    "Hospital address is required.",
    "Hospital address is too long.",
  ),
  contactPhone: phoneSchema,
  requesterName: optionalText(100, "Requester name is too long."),
  notes: optionalText(1000, "Notes are too long."),
};

export const bloodRequestSchema = z.strictObject({
  ...bloodRequestFields,
  ...transportFields,
});
