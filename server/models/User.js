// server/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Profile photo
    profilePhotoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    profilePhotoPublicId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);