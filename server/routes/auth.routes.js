// server/routes/auth.routes.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashed,
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );

  res.status(201).json({
    token,
    user,
  });


  } catch (error) {
      res.status(400).json({
      message: error.message || "Signup failed",
    });
  }
});

router.post("/login", async (req, res) => {
try {
const user = await User.findOne({
email: req.body.email,
});

if (!user) {
  return res.status(401).json({
    message: "Invalid email or password",
  });
}

const ok = await bcrypt.compare(
  req.body.password,
  user.password
);

if (!ok) {
  return res.status(401).json({
    message: "Invalid email or password",
  });
}

const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET
);

res.json({
  token,
  user,
});


} catch (error) {
      res.status(500).json({
      message: "Login failed",
    });
  }
});

export default router;
