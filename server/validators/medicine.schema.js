// server/validators/medicine.schema.js

// Validates medicine request shape before controller and service logic.

import { z } from "zod";

import {
  DOSAGE_TIMES,
  MEDICINE_TYPES,
  getPricingTypeForMedicine,
} from "../utils/medicine/medicineHelpers.js";

const numberValue = (schema) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : value,
    schema,
  );

const dateValue = z
  .union([
    z.date(),
    z
      .string()
      .trim()
      .min(1, { message: "Please provide a valid date." })
      .refine(
        (value) => {
          const date = new Date(value);

          if (Number.isNaN(date.getTime())) {
            return false;
          }

          // Reject normalized calendar dates such as 2026-02-30.
          const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

          if (!match) {
            return false;
          }

          const [, year, month, day] = match;

          return (
            date.getUTCFullYear() === Number(year) &&
            date.getUTCMonth() + 1 === Number(month) &&
            date.getUTCDate() === Number(day)
          );
        },
        {
          message: "Please provide a valid date.",
        },
      ),
  ])
  .transform((value) => new Date(value));

const dosageItemSchema = z.strictObject({
  time: z.enum(DOSAGE_TIMES, { message: "Invalid dosage time." }),
  quantity: numberValue(
    z
      .number({ message: "Dosage quantity must be a number." })
      .finite()
      .int({ message: "Dosage quantity must be an integer." })
      .min(1, { message: "Dosage quantity must be a positive integer." }),
  ),
});

const medicineSchema = z
  .strictObject({
    name: z
      .string({ message: "Medicine name is required." })
      .trim()
      .min(1, { message: "Medicine name is required." }),
    type: z.enum(MEDICINE_TYPES, { message: "Invalid medicine type." }),
    pricingType: z.enum(["strip", "unit"], {
      message: "Invalid pricing type.",
    }),
    dosage: z.array(dosageItemSchema).default([]),
    pricePerStrip: numberValue(
      z
        .number({ message: "Please enter a valid price per strip." })
        .finite()
        .positive({ message: "Please enter a valid price per strip." })
        .nullable(),
    ),
    piecesPerStrip: numberValue(
      z
        .number({ message: "Pieces per strip must be a positive integer." })
        .finite()
        .int({ message: "Pieces per strip must be a positive integer." })
        .min(1, { message: "Pieces per strip must be a positive integer." })
        .nullable(),
    ),
    pricePerUnit: numberValue(
      z
        .number({ message: "Please enter a valid price per unit." })
        .finite()
        .positive({ message: "Please enter a valid price per unit." })
        .nullable(),
    ),
    unitsPerMonth: numberValue(
      z
        .number({
          message: "Units needed per month must be a positive integer.",
        })
        .finite()
        .int({
          message: "Units needed per month must be a positive integer.",
        })
        .min(1, {
          message: "Units needed per month must be a positive integer.",
        })
        .nullable(),
    ),
    imageUrl: z
      .string({ message: "Image URL must be a string." })
      .trim()
      .default(""),
    startDate: dateValue,
    endDate: dateValue.nullable().optional().default(null),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, context) => {
    const dosageTimes = new Set();

    for (const [index, item] of data.dosage.entries()) {
      if (dosageTimes.has(item.time)) {
        context.addIssue({
          code: "custom",
          path: ["dosage", index, "time"],
          message: "Each dosage time can only be selected once.",
        });
      }

      dosageTimes.add(item.time);
    }

    const expectedPricingType = getPricingTypeForMedicine(data.type);

    if (data.pricingType !== expectedPricingType) {
      context.addIssue({
        code: "custom",
        path: ["pricingType"],
        message: "Invalid pricing type for the selected medicine type.",
      });
    }

    if (data.pricingType === "strip") {
      if (data.dosage.length === 0) {
        context.addIssue({
          code: "custom",
          path: ["dosage"],
          message: "Please select at least one dosage time.",
        });
      }

      if (data.pricePerStrip === null || data.piecesPerStrip === null) {
        context.addIssue({
          code: "custom",
          path: ["pricePerStrip"],
          message: "Strip pricing fields are required.",
        });
      }

      if (data.pricePerUnit !== null || data.unitsPerMonth !== null) {
        context.addIssue({
          code: "custom",
          path: ["pricePerUnit"],
          message: "Unit pricing fields must be empty for strip medicines.",
        });
      }
    } else {
      if (data.dosage.length > 0) {
        context.addIssue({
          code: "custom",
          path: ["dosage"],
          message: "Unit medicines cannot have a dosage schedule for pricing.",
        });
      }

      if (data.pricePerUnit === null || data.unitsPerMonth === null) {
        context.addIssue({
          code: "custom",
          path: ["pricePerUnit"],
          message: "Unit pricing fields are required.",
        });
      }

      if (data.pricePerStrip !== null || data.piecesPerStrip !== null) {
        context.addIssue({
          code: "custom",
          path: ["pricePerStrip"],
          message: "Strip pricing fields must be empty for unit medicines.",
        });
      }
    }

    if (data.isActive && data.endDate !== null) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Active medicines cannot have an end date.",
      });
    }

    if (!data.isActive && data.endDate === null) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "A valid end date is required for a past medicine.",
      });
    }

    if (
      data.endDate &&
      data.startDate &&
      data.endDate.getTime() < data.startDate.getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be earlier than the start date.",
      });
    }
  });

export const createMedicineSchema = medicineSchema;
export const updateMedicineSchema = medicineSchema;