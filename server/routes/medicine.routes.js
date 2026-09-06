// server/routes/medicine.routes.js

import express from "express";
import mongoose from "mongoose";

import Medicine from "../models/Medicine.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * ==========================================================
 * DATE HELPERS
 * ==========================================================
 */

function normalizeDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function validateMedicineDates({ startDate, endDate, isActive }) {
  const normalizedStartDate = normalizeDate(startDate);
  const normalizedEndDate = normalizeDate(endDate);

  if (!normalizedStartDate) {
    return {
      error: "Start month and year are required.",
    };
  }

  if (!isActive && !normalizedEndDate) {
    return {
      error: "End month and year are required for past medicines.",
    };
  }

  if (
    !isActive &&
    normalizedEndDate &&
    normalizedEndDate < normalizedStartDate
  ) {
    return {
      error: "End month cannot be earlier than the start month.",
    };
  }

  return {
    startDate: normalizedStartDate,
    endDate: isActive ? null : normalizedEndDate,
  };
}

/*
 * ==========================================================
 * GET ALL MEDICINES
 * ==========================================================
 */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const medicines = await Medicine.find({
      user: req.userId,
    }).sort({
      isActive: -1,
      startDate: -1,
    });

    res.json(medicines);
  } catch (error) {
    console.error("Get medicines error:", error);

    res.status(500).json({
      message: "Failed to fetch medicines.",
    });
  }
});

/*
 * ==========================================================
 * CREATE MEDICINE
 * ==========================================================
 */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      dosageTimes,
      imageUrl,
      startDate,
      endDate,
      isActive = true,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Medicine name is required.",
      });
    }

    const validatedDates = validateMedicineDates({
      startDate,
      endDate,
      isActive,
    });

    if (validatedDates.error) {
      return res.status(400).json({
        message: validatedDates.error,
      });
    }

    const medicine = await Medicine.create({
      user: req.userId,
      name: name.trim(),
      dosageTimes: Array.isArray(dosageTimes) ? dosageTimes : [],
      imageUrl: imageUrl?.trim() || "",
      startDate: validatedDates.startDate,
      endDate: validatedDates.endDate,
      isActive: Boolean(isActive),
    });

    res.status(201).json(medicine);
  } catch (error) {
    console.error("Create medicine error:", error);

    res.status(500).json({
      message: "Failed to create medicine.",
    });
  }
});

/*
 * ==========================================================
 * UPDATE MEDICINE
 * ==========================================================
 */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid medicine ID.",
      });
    }

    const {
      name,
      dosageTimes,
      imageUrl,
      startDate,
      endDate,
      isActive = true,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Medicine name is required.",
      });
    }

    const validatedDates = validateMedicineDates({
      startDate,
      endDate,
      isActive,
    });

    if (validatedDates.error) {
      return res.status(400).json({
        message: validatedDates.error,
      });
    }

    const medicine = await Medicine.findOneAndUpdate(
      {
        _id: id,
        user: req.userId,
      },
      {
        name: name.trim(),
        dosageTimes: Array.isArray(dosageTimes) ? dosageTimes : [],
        imageUrl: imageUrl?.trim() || "",
        startDate: validatedDates.startDate,
        endDate: validatedDates.endDate,
        isActive: Boolean(isActive),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found.",
      });
    }

    res.json(medicine);
  } catch (error) {
    console.error("Update medicine error:", error);

    res.status(500).json({
      message: "Failed to update medicine.",
    });
  }
});

/*
 * ==========================================================
 * DELETE MEDICINE
 * ==========================================================
 */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid medicine ID.",
      });
    }

    const medicine = await Medicine.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found.",
      });
    }

    res.json({
      message: "Medicine deleted successfully.",
    });
  } catch (error) {
    console.error("Delete medicine error:", error);

    res.status(500).json({
      message: "Failed to delete medicine.",
    });
  }
});

export default router;
