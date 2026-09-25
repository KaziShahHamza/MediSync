// server/routes/profile.routes.js

// Defines authenticated routes for profile and profile-photo operations.

import express from "express";

import auth from "../middlewares/auth.js";

import {
  getProfile,
  createProfileController,
  updateProfileController,
  updateProfilePhotoController,
  removeProfilePhotoController,
} from "../controllers/profileController.js";

const router = express.Router();

// Fetch the authenticated user's profile.
router.get("/", auth, getProfile);

// Create a new profile.
router.post("/", auth, createProfileController);

// Update the existing profile.
router.put("/", auth, updateProfileController);

// Update profile photo metadata.
router.put("/photo", auth, updateProfilePhotoController);

// Remove the current profile photo.
router.delete("/photo", auth, removeProfilePhotoController);

export default router;
