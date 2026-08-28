// server/server.js

import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import healthRoutes from "./routes/health.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/medisync2")
//   .then(() => console.log("MongoDB connected"));
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  } finally {
    console.log("MongoDB connection attempt finished");
  }
}

connectDB();

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/doctors", doctorRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});