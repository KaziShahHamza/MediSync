// server/routes/profile.routes.js

import express from "express";
import auth from "../middleware/auth.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

import { syncProfileToAIChatData } from "../services/aiChatDataService.js";

const router = express.Router();

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
  "location",
  "bloodDonationContactNumber",
];

function getProfileData(body) {
  return Object.fromEntries(
    allowedProfileFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]]),
  );
}

// GET Profile
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

// Create profile
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

// Update profile
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

export default router;
