// server/routes/dashboard.routes.js

// Defines the protected dashboard endpoint and connects it to the controller.

import express from "express";

import auth from "../middlewares/auth.js";

import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

// Require authentication before accessing dashboard data.
router.get("/", auth, getDashboard);

export default router;
