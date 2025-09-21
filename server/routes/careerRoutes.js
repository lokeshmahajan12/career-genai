import express from "express";
import { buildModel, trainModel, predictCareer } from "../models/careerModel.js";

const router = express.Router();

// Build and train model on server start
await buildModel();
await trainModel();

router.post("/predict", (req, res) => {
  try {
    const { features } = req.body; // 10 numeric features
    if (!features || features.length !== 10) {
      return res.status(400).json({ success: false, error: "Provide 10 numeric features" });
    }
    const careerIndex = predictCareer(features);
    res.json({ success: true, careerIndex });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
