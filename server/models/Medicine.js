// server/models/Medicine.js

import mongoose from "mongoose";

const dosageSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      enum: ["morning", "noon", "night"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Dosage quantity must be an integer.",
      },
    },
  },
  { _id: false },
);

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "tablet",
        "capsule",
        "syrup",
        "antibiotic",
        "injection",
        "cream",
        "ointment",
        "drops",
        "inhaler",
        "other",
      ],
      default: "tablet",
    },

    /*
     * ========================================================
     * PRICING TYPE
     * ========================================================
     *
     * tablet / capsule -> strip pricing
     * everything else -> unit pricing
     *
     * This is stored explicitly so the frontend and backend
     * can clearly understand how the medicine is priced.
     */

    pricingType: {
      type: String,
      enum: ["strip", "unit"],
      required: true,
    },

    /*
     * ========================================================
     * STRIP MEDICINE PRICING
     * ========================================================
     *
     * Used only for tablet / capsule.
     */

    pricePerStrip: {
      type: Number,
      default: null,
      min: 0,
    },

    piecesPerStrip: {
      type: Number,
      default: null,
      min: 1,
      validate: {
        validator: function (value) {
          return value == null || Number.isInteger(value);
        },
        message: "Pieces per strip must be an integer.",
      },
    },

    /*
     * ========================================================
     * UNIT MEDICINE PRICING
     * ========================================================
     *
     * Used for syrup, injection, cream, ointment, drops,
     * inhaler, antibiotic and other unit-priced medicines.
     */

    pricePerUnit: {
      type: Number,
      default: null,
      min: 0,
    },

    unitsPerMonth: {
      type: Number,
      default: null,
      min: 1,
      validate: {
        validator: function (value) {
          return value == null || Number.isInteger(value);
        },
        message: "Units needed per month must be an integer.",
      },
    },

    /*
     * ========================================================
     * DOSAGE
     * ========================================================
     *
     * Used only for strip medicines.
     *
     * Unit medicines should have an empty dosage array.
     */

    dosage: {
      type: [dosageSchema],
      default: [],
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Medicine", medicineSchema);