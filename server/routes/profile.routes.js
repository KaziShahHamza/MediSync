// server/routes/profile.routes.js

// Defines authenticated profile and profile-photo API endpoints.

import express from "express";

import auth from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

import {
  getProfile,
  createProfileController,
  updateProfileController,
  updateProfilePhotoController,
  removeProfilePhotoController,
} from "../controllers/profileController.js";

import { profileSchema } from "../validators/profile.schema.js";
import { profilePhotoSchema } from "../validators/profilePhoto.schema.js";

const router = express.Router();

router.get("/", auth, getProfile);

router.post("/", auth, validate(profileSchema), createProfileController);

router.put("/", auth, validate(profileSchema), updateProfileController);

router.put(
  "/photo",
  auth,
  validate(profilePhotoSchema),
  updateProfilePhotoController,
);

router.delete("/photo", auth, removeProfilePhotoController);

export default router;
