// server/routes/geminiRoutes.js
import express from "express";
import { generateGeminiContent } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/", generateGeminiContent);

export default router;
