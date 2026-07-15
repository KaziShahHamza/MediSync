import express from "express";
import Doctor from "../models/Doctor.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all doctors
router.get("/", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(doctors);
  } catch {
    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
});

// Add doctor
router.post("/", auth, async (req, res) => {
  try {
    const doctor = await Doctor.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json(doctor);
  } catch {
    res.status(400).json({
      message: "Failed to create doctor",
    });
  }
});

// Update doctor
router.put("/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch {
    res.status(400).json({
      message: "Failed to update doctor",
    });
  }
});

// Delete doctor
router.delete("/:id", auth, async (req, res) => {
  try {
    await Doctor.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    res.json({
      success: true,
    });
  } catch {
    res.status(400).json({
      message: "Failed to delete doctor",
    });
  }
});

export default router;