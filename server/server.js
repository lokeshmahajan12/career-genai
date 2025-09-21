import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load environment variables at the very top
dotenv.config();


import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import geminiRoutes from "./routes/geminiRoute.js";
import careerRoutes from "./routes/careerRoutes.js";

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// Rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use("/api/", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analyze", resumeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/career", careerRoutes);

// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Root endpoint
app.get("/", (req, res) => res.send("✅ Backend is running..."));

// Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("🔑 GEMINI_API_KEY loaded? ", process.env.GEMINI_API_KEY ? "✅ YES" : "❌ NO");
    });
  })
  .catch((err) => console.error("MongoDB connection failed:", err.message));
