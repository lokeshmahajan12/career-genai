import fs from "fs";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text.trim();

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ error: "Resume is empty or too short." });
    }

    console.log("📂 File uploaded:", req.file.originalname);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt: Extract skills + generate 5 relevant jobs in JSON
    const prompt = `
Analyze this resume and suggest 5 relevant jobs.
Return JSON only. Include job title, company, location, why the candidate is suitable, and application link.
Resume Text: """${resumeText}"""
Format:
{
  "jobs": [
    {
      "title":"Job Title",
      "company":"Company Name",
      "location":"City, Country",
      "matchReason":"Why this candidate is suitable",
      "link":"Job Apply URL"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let text = await result.response.text();

    // Clean AI output
    text = text.trim();
    if (text.startsWith("```")) {
      const firstLineEnd = text.indexOf("\n");
      text = text.slice(firstLineEnd + 1);
    }
    if (text.endsWith("```")) {
      text = text.slice(0, -3);
    }
    text = text.trim();

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("❌ Invalid JSON from AI after cleanup:", text);
      return res.status(500).json({ error: "AI returned invalid JSON", raw: text });
    }

    res.json(parsed); // Only send job suggestions
  } catch (error) {
    console.error("❌ Resume analysis failed:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
};
