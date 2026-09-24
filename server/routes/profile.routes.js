// server/routes/profile.routes.js

import express from "express";
import auth from "../middlewares/auth.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

import { syncProfileToAIChatData } from "../services/aiChatDataService.js";

const router = express.Router();

// =========================
// CLOUDINARY CONFIG
// =========================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =========================
// PROFILE FIELDS
// =========================

const allowedProfileFields = [
  "dob",
  "gender",
  "height",
  "bloodGroup",
  "location",
  "allergies",
  "chronicIllnesses",
  "surgeries",
  "emergencyContacts",
  "bloodDonorStatus",
  "bloodDonationCompensation",
  "lastBloodDonation",
  "bloodDonationContactNumber",
];

function getProfileData(body) {
  return Object.fromEntries(
    allowedProfileFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]]),
  );
}

// =========================
// GET PROFILE
// =========================

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    const profile = await Profile.findOne({
      user: req.userId,
    });

    res.json({
      user,
      profile: profile || null,
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
});

// =========================
// CREATE PROFILE
// =========================

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const profileData = getProfileData(req.body);

    const exists = await Profile.findOne({
      user: req.userId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    if (name?.trim()) {
      await User.findByIdAndUpdate(req.userId, {
        name: name.trim(),
      });
    }

    const profile = await Profile.create({
      ...profileData,
      user: req.userId,
    });

    try {
      await syncProfileToAIChatData(req.userId);
    } catch (error) {
      console.error("Failed to sync profile to AI chat data:", error);
    }

    const user = await User.findById(req.userId).select("-password");

    res.status(201).json({
      user,
      profile,
    });
  } catch (err) {
    console.error("Failed to create profile:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// UPDATE PROFILE
// =========================

router.put("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const profileData = getProfileData(req.body);

    if (name?.trim()) {
      await User.findByIdAndUpdate(req.userId, {
        name: name.trim(),
      });
    }

    const profile = await Profile.findOneAndUpdate(
      {
        user: req.userId,
      },
      profileData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    try {
      await syncProfileToAIChatData(req.userId);
    } catch (error) {
      console.error("Failed to sync profile to AI chat data:", error);
    }

    const user = await User.findById(req.userId).select("-password");

    res.json({
      user,
      profile,
    });
  } catch (err) {
    console.error("Failed to update profile:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// UPDATE PROFILE PHOTO
// =========================

router.put("/photo", auth, async (req, res) => {
  try {
    const { profilePhotoUrl, profilePhotoPublicId } = req.body;

    if (!profilePhotoUrl || !profilePhotoPublicId) {
      return res.status(400).json({
        message: "Profile photo information is required.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        profilePhotoUrl,
        profilePhotoPublicId,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "Profile photo updated successfully.",
      user,
    });
  } catch (err) {
    console.error("Failed to update profile photo:", err);

    res.status(500).json({
      message: "Failed to update profile photo.",
    });
  }
});

// =========================
// REMOVE PROFILE PHOTO
// =========================

router.delete("/photo", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Delete from Cloudinary if a public ID exists.
    if (user.profilePhotoPublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePhotoPublicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete profile photo from Cloudinary:",
          cloudinaryError,
        );

        // Do not stop the database cleanup.
        // The user's profile photo should still be removed
        // from the application.
      }
    }

    user.profilePhotoUrl = "";
    user.profilePhotoPublicId = "";

    await user.save();

    const safeUser = await User.findById(req.userId).select("-password");

    res.json({
      message: "Profile photo removed successfully.",
      user: safeUser,
    });
  } catch (err) {
    console.error("Failed to remove profile photo:", err);

    res.status(500).json({
      message: "Failed to remove profile photo.",
    });
  }
});

export default router;
