// server/routes/auth.routes.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// =========================
// SIGNUP
// =========================

router.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Password validation
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // Check username
    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Safe user data
    const userData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    return res.status(201).json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Signup failed",
    });
  }
});

// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    let user;

    // Check whether identifier is an email
    const isEmail = identifier.includes("@");

    if (isEmail) {
      user = await User.findOne({
        email: identifier.toLowerCase(),
      });
    } else {
      user = await User.findOne({
        username: identifier.toLowerCase(),
      });
    }

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check password
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Safe user data
    const userData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    return res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

export default router;
