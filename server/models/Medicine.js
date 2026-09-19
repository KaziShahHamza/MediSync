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
      min: 0.01,
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

    dosage: {
      type: [dosageSchema],
      default: [],
    },

    pricePerStrip: {
      type: Number,
      required: true,
      min: 0,
    },

    piecesPerStrip: {
      type: Number,
      required: true,
      min: 1,
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