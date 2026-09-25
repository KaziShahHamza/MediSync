// server/routes/auth.routes.js

// Defines authentication endpoints and connects them to auth controllers.

import express from "express";

import {
  signup,
  login,
} from "../controllers/authController.js";

const router = express.Router();

// Register a new user account.
router.post("/signup", signup);

// Authenticate an existing user account.
router.post("/login", login);

export default router;