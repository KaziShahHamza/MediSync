// server/models/User.js

// Defines the core authenticated user account.
// Stores identity, login credentials, and profile photo metadata.

import mongoose from "mongoose";

// Defines the user account document structure.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
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
