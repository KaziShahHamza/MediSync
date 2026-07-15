import express from "express";
import Prescription from "../models/Prescription.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all prescriptions
router.get("/", auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch prescriptions",
    });
  }
});

// Create prescription
router.post("/", auth, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    const prescription = await Prescription.create({
      user: req.userId,
      title,
      imageUrl,
    });

    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create prescription",
    });
  }
});

// Delete prescription
router.delete("/:id", auth, async (req, res) => {
  try {
    await Prescription.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete prescription",
    });
  }
});

export default router;