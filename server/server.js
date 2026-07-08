// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/medisync2")
//   .then(() => console.log("MongoDB connected"));

mongoose.connect("mongodb+srv://kazishahhamza01_db_user:7SSKHfiQiqcY53re@cluster0.9yvjrsn.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB connected"));

app.use("/api/medicines", medicineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
