import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { chat, generateAdvice, recommendCourses, getCourses } from "../controllers/aiController.js";

const router = Router();

router.post("/chat", protect, chat);
router.post("/advice", protect, generateAdvice);
router.post("/courses", protect, getCourses);  // ✅ ensure this calls getCourses

export default router;
