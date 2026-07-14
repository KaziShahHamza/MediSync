import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
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

    smoking: {
      type: String,
      enum: ["Never", "Former", "Current"],
      default: "",
    },

    alcohol: {
      type: String,
      enum: ["Never", "Occasionally", "Frequently"],
      default: "",
    },

    exercise: {
      type: String,
      enum: ["Never", "1-2 Days", "3-5 Days", "Daily"],
      default: "",
    },

    diet: {
      type: String,
      enum: ["Mixed", "Vegetarian", "Vegan"],
      default: "",
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);