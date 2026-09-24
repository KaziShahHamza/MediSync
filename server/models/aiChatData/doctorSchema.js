// server/models/aiChatData/doctorSchema.js

// Defines doctor information stored for AI chat context.
// Includes doctor identity, specialties, chambers, and contact information.

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    name: {
      type: String,
      default: "",
    },

    specialities: {
      type: [String],
      default: [],
    },

    designation: {
      type: String,
      default: "",
    },

    primaryHospital: {
      type: String,
      default: "",
    },

    chambers: [
      {
        name: {
          type: String,
          default: "",
        },

        address: {
          type: String,
          default: "",
        },

        phone: {
          type: String,
          default: "",
        },

        visitingDays: {
          type: [String],
          default: [],
        },

        visitingTime: {
          startHour: {
            type: Number,
            default: null,
          },

          startPeriod: {
            type: String,
            default: null,
          },

          endHour: {
            type: Number,
            default: null,
          },

          endPeriod: {
            type: String,
            default: null,
          },
        },
      },
    ],

    contactInfo: {
      phones: {
        type: [String],
        default: [],
      },

      emails: {
        type: [String],
        default: [],
      },
    },
  },
  {
    _id: false,
  },
);

export default doctorSchema;
