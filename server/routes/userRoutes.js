import { Router } from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get user by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Analyze user profile
router.post("/analyze-user/:id", protect, async (req, res) => {
  try {
    const { skills, interests, experience, education, location, industry } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // AI Prompt
    const prompt = `
Analyze this user profile:
Skills: ${skills}
Interests: ${interests}
Experience: ${experience}
Education: ${education}
Location: ${location}
Industry: ${industry}

Provide only JSON:
{
  "skills": ["..."],
  "jobs": [{"title":"","company":"","matchScore":0}],
  "courses": [{"name":"","link":""}],
  "careerSuggestions": [{"title":"","reason":""}]
}
`;

    // ✅ Correct Gemini API usage
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const aiText = result.response.text(); // AI raw text
    let analysis;
    try {
      analysis = JSON.parse(aiText);
    } catch (err) {
      console.warn("JSON parse failed, using fallback:", err.message);
      analysis = {
        skills: skills ? skills.split(",").map((s) => s.trim()) : [],
        jobs: [],
        courses: [],
        careerSuggestions: [],
      };
    }

    // Save profile + analysis
    user.skills = skills ? skills.split(",").map((s) => s.trim()) : [];
    user.interests = interests ? interests.split(",").map((s) => s.trim()) : [];
    user.experience = experience;
    user.education = education;
    user.location = location;
    user.industry = industry;
    user.analysis = analysis;
    await user.save();

    res.json(analysis);
  } catch (err) {
    console.error("Analysis failed:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

export default router;
