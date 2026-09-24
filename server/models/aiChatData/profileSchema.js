// server/models/aiChatData/profileSchema.js

// Defines the profile-related AI chat data schema.
// Keeps personal and emergency information separate from the main model.

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      default: "",
    },

    height: {
      feet: {
        type: Number,
        default: null,
      },

      inches: {
        type: Number,
        default: null,
      },
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    allergies: {
      type: String,
      default: "",
    },

    chronicIllnesses: {
      type: [String],
      default: [],
    },

    surgeries: {
      type: String,
      default: "",
    },

    emergencyContacts: {
      type: [
        {
          relation: {
            type: String,
            default: "",
          },

          name: {
            type: String,
            default: "",
          },

          phone: {
            type: String,
            default: "",
          },

          email: {
            type: String,
            default: "",
          },
        },
      ],

      default: [],
    },

    bloodDonorStatus: {
      type: String,
      default: "",
    },

    lastBloodDonation: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

export default profileSchema;
