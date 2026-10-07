// server/routes/auth.routes.js

// Defines authentication endpoints and connects them to auth controllers.

import express from "express";

import { signup, login } from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import { loginSchema, signupSchema } from "../validators/auth.schema.js";

const router = express.Router();

// Register a new user account.
router.post("/signup", validate(signupSchema), signup);

// Authenticate an existing user account.
router.post("/login", validate(loginSchema), login);

export default router;
