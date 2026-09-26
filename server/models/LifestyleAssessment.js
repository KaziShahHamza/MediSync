// server/models/LifestyleAssessment.js

// Defines stored lifestyle assessment results for each user.
// Preserves answers, category scores, grade, and generated feedback.

import mongoose from "mongoose";

// Defines the lifestyle assessment document structure.
const lifestyleAssessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    categoryScores: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      required: true,
      enum: ["A+", "A", "A-", "B", "C"],
    },

    feedback: {
      type: String,
      required: true,
    },

    assessedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Supports chronological retrieval of user assessments.
lifestyleAssessmentSchema.index({
  user: 1,
  assessedAt: -1,
});

export default mongoose.model("LifestyleAssessment", lifestyleAssessmentSchema);
