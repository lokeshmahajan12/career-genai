import Profile from "../models/Profile.js";
import axios from "axios";

// Upsert profile + AI response
export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // ensure auth middleware provides user.id
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const { skills, interests, experience, education, location, industry } = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({ user: userId });
    }

    profile.skills = skills || [];
    profile.interests = interests || [];
    profile.experience = experience || "";
    profile.education = education || "";
    profile.location = location || "";
    profile.industry = industry || "";

    // --- Call AI (Gemini/ChatGPT) ---
    const aiPrompt = `
      User Profile:
      Skills: ${skills.join(", ")}
      Interests: ${interests.join(", ")}
      Experience: ${experience}
      Education: ${education}
      Location: ${location}
      Industry: ${industry}
      
      Generate:
      1. Top 3 Career Suggestions
      2. Top 3 Recommended Courses
      3. Skill Gaps
      4. Future Trends
    `;

    // Example using OpenAI GPT API (Gemini API can be similar)
    const aiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: aiPrompt }],
        max_tokens: 800,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    const aiResponse = aiRes.data.choices[0].message.content;
    profile.aiResponse = JSON.parse(aiResponse || "{}"); // AI should return JSON

    await profile.save();
    res.json({ message: "Profile saved & AI response generated!", profile });
  } catch (err) {
    console.error("Upsert profile error:", err);
    res.status(500).json({ message: "Error saving profile", error: err.message });
  }
};

// Get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};
