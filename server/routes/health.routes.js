// server/routes/health.routes.js
import express from "express";
import HealthLog from "../models/HealthLog.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// create log
router.post("/", auth, async (req, res) => {
  try {
    const log = await HealthLog.create({
      ...req.body,
      user: req.userId 
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
