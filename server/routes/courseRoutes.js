import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { recommendCourses, seedCourses } from "../controllers/courseController.js";

const router = Router();

// AI-powered top courses
router.post("/courses", protect, recommendCourses);

// Optional: seed static courses
router.post("/courses/seed", protect, seedCourses);

export default router;
