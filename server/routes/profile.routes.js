import express from "express";
import auth from "../middleware/auth.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

const router = express.Router();

/*
GET Profile
Returns user info + profile
*/
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

/*
Create profile
*/
router.post("/", auth, async (req, res) => {
  try {
    const exists = await Profile.findOne({
      user: req.userId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    const profile = await Profile.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

/*
Update profile
*/
router.put("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {
        user: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

export default router;