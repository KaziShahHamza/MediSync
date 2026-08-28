// server/models/Medicine.js

import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    dosageTimes: {
      type: [String],
      enum: ["morning", "noon", "night"],
      default: []
    },

    imageUrl: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Medicine", medicineSchema);
