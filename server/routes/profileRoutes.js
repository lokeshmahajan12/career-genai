import express from "express";
import { upsertProfile, getProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js"; // ensure user auth

const router = express.Router();

router.get("/", protect, getProfile);
router.post("/", protect, upsertProfile);

export default router;
