import express from "express";
import auth from "../middleware/auth.js";
import { getDashboardData } from "../services/dashboardService.js";


const router = express.Router();


router.get("/", auth, async (req, res) => {

  try {

    const data = await getDashboardData(
      req.userId
    );

    res.json(data);


  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to load dashboard",
    });

  }

});


export default router;