// server/routes/doctor.routes.js

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
  } catch (error) {
    console.error("Failed to fetch doctors:", error);

    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
});

// Add doctor
router.post("/", auth, async (req, res) => {
  try {
    const doctorData = {
      ...req.body,
      user: req.userId,
    };

    // Never allow client-provided user ID
    delete doctorData.user;

    const doctor = await Doctor.create({
      ...doctorData,
      user: req.userId,
    });

    res.status(201).json(doctor);
  } catch (error) {
    console.error("Failed to create doctor:", error);

    res.status(400).json({
      message: "Failed to create doctor",
    });
  }
});

// Update doctor
router.put("/:id", auth, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // Prevent changing ownership
    delete updateData.user;

    const doctor = await Doctor.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Failed to update doctor:", error);

    res.status(400).json({
      message: "Failed to update doctor",
    });
  }
});

// Delete doctor
router.delete("/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to delete doctor:", error);

    res.status(400).json({
      message: "Failed to delete doctor",
    });
  }
});

export default router;
