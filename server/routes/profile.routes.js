// server/routes/profile.routes.js

import express from "express";
import auth from "../middleware/auth.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

const router = express.Router();

// GET Profile, Returns user info + profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    let profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      return res.json({
        user,
        profile: null,
      });
    }

    res.json({
      user,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
});

// Create profile
router.post("/", auth, async (req, res) => {
  try {
    const { name, ...profileData } = req.body;

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

    const user = await User.findById(req.userId).select("-password");

    res.status(201).json({
      user,
      profile,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// Update profile
router.put("/", auth, async (req, res) => {
  try {
    const { name, ...profileData } = req.body;

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

    const user = await User.findById(req.userId).select("-password");

    res.json({
      user,
      profile,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

export default router;
