// server/routes/medicine.routes.js

import express from "express";
import Medicine from "../models/Medicine.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const meds = await Medicine.find({
      user: req.userId,
    }).sort({
      isActive: -1,
      startDate: -1,
    });

    res.json(meds);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch medicines",
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, dosageTimes, imageUrl, startDate, endDate, isActive } =
      req.body;

    const med = await Medicine.create({
      name,
      dosageTimes,
      imageUrl,
      startDate,
      endDate: isActive ? null : endDate,
      isActive,
      user: req.userId,
    });

    res.status(201).json(med);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create medicine",
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { name, dosageTimes, imageUrl, startDate, endDate, isActive } =
      req.body;

    const medicine = await Medicine.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        name,
        dosageTimes,
        imageUrl,
        startDate,
        endDate: isActive ? null : endDate,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    res.json(medicine);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update medicine",
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete medicine",
    });
  }
});

export default router;
