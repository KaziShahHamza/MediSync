// server/routes/health.routes.js

import express from "express";
import HealthLog from "../models/HealthLog.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// create log
router.post("/", auth, async (req, res) => {
  try {
    const { type, recordedAt } = req.body;

    // Blood sugar records require a measurement date.
    if (type === "diabetes") {
      if (!recordedAt) {
        return res.status(400).json({
          message: "Blood sugar measurement date is required.",
        });
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(recordedAt)) {
        return res.status(400).json({
          message: "Invalid blood sugar measurement date.",
        });
      }
    }

    const log = await HealthLog.create({
      ...req.body,
      user: req.userId,
    });

    res.json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get user logs
router.get("/", auth, async (req, res) => {
  const logs = await HealthLog.find({
    user: req.userId 
  }).sort({ createdAt: 1 });

  res.json(logs);
});

// delete log
router.delete("/:id", auth, async (req, res) => {
  await HealthLog.findOneAndDelete({
    _id: req.params.id,
    user: req.userId 
  });

  res.json({ success: true });
});

export default router;
