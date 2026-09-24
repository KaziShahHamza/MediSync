// server/models/aiChatData/healthSchema.js

// Defines the latest health information used by AI chat.
// Keeps weight, BMI, blood pressure, and blood sugar together.

import mongoose from "mongoose";

const healthSchema = new mongoose.Schema(
  {
    latestWeight: {
      value: {
        type: Number,
        default: null,
      },

      recordedAt: {
        type: String,
        default: "",
      },
    },

    bmi: {
      value: {
        type: Number,
        default: null,
      },

      category: {
        type: String,
        default: "",
      },
    },

    bloodPressure: {
      high: {
        type: Number,
        default: null,
      },

      low: {
        type: Number,
        default: null,
      },

      recordedAt: {
        type: String,
        default: "",
      },
    },

    bloodSugar: {
      fasting: {
        glucose: {
          type: Number,
          default: null,
        },

        recordedAt: {
          type: String,
          default: "",
        },
      },

      postMeal: {
        glucose: {
          type: Number,
          default: null,
        },

        recordedAt: {
          type: String,
          default: "",
        },
      },

      random: {
        glucose: {
          type: Number,
          default: null,
        },

        recordedAt: {
          type: String,
          default: "",
        },
      },
    },
  },
  {
    _id: false,
  },
);

export default healthSchema;
