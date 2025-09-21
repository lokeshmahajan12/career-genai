// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";
import Advice from "../models/Advice.js";
import Course from "../models/Course.js";
import { topK } from "../utils/vectorStore.js";
import { skillGap } from "../utils/scoring.js";
import { getEmbedding } from "../utils/embeddings.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;


// ------------------ CHAT WITH GEMINI ------------------
export const chat = async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest" });

    // Make sure we await the content properly
    const result = await model.generateContent(query);

    // Gemini response may be nested differently
    let answer = "No answer from Gemini";
    if (result?.response?.text) {
      answer = await result.response.text();
    } else if (result?.response?.message) {
      answer = result.response.message;
    }

    res.json({ answer });
  } catch (err) {
    console.error("Gemini Chat Error:", err);
    res.status(500).json({ error: "Gemini chat failed", details: err.message });
  }
};


// ------------------ GOOGLE AI (optional) ------------------
export const googleChat = async (req, res) => {
  try {
    const { query } = req.body;
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ message: "GOOGLE_API_KEY not set in .env" });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage",
      { prompt: { text: query } },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GOOGLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data?.candidates?.[0]?.content || "No response";
    res.json({ answer });
  } catch (err) {
    console.error("Google AI Chat Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Google AI chat failed" });
  }
};

// ------------------ ADVICE ------------------
export const generateAdvice = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ user: userId }).lean();
    if (!profile) return res.status(400).json({ message: "Complete profile first." });

    const targetSkills = [
      ...(profile.goals?.toLowerCase().includes("full stack") ? ["js", "react", "node", "db"] : []),
      "git", "dsa",
    ];
    const { missing } = skillGap(profile.skills || [], targetSkills);

    const prompt = `Build a crisp 6-week roadmap for a student with skills: ${profile.skills?.join(
      ", "
    )} aiming for goals: ${profile.goals}. Missing skills: ${missing.join(
      ", "
    )}. Return JSON with fields: summary, roadmap[{title,weeks,skills,resources}]`;

    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    let data;
    try {
      data = JSON.parse(result.response?.text() || "{}");
    } catch {
      data = { summary: "N/A", roadmap: [] };
    }

    const saved = await Advice.create({ user: userId, summary: data.summary, roadmap: data.roadmap });
    res.json(saved);
  } catch (err) {
    console.error("Gemini Advice Error:", err);
    res.status(500).json({ error: "AI advice failed" });
  }
};
// ------------------ COURSE RECOMMENDATIONS ------------------
export const recommendCourses = async (req, res) => {
  try {
    const { query = "" } = req.body;
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId }).lean();

    const text = `${query} ${profile?.skills?.join(" ") ?? ""} ${profile?.goals ?? ""}`;

    const qEmbed = await getEmbedding(text);

    const all = await Course.find({}).lean();

    const ranked = topK(
      qEmbed,
      all.map((c) => ({ ...c, embedding: c.embedding })),
      6
    );

    res.json(
      ranked.map(({ _id, title, provider, url, tags, level, score }) => ({
        _id,
        title,
        provider,
        url,
        tags,
        level,
        score,
      }))
    );
  } catch (err) {
    console.error("Gemini Courses Error:", err);
    res.status(500).json({ error: "Course recommendation failed" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { query } = req.body;
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

    const prompt = `Suggest top 6 online courses for: ${query}. 
Return ONLY valid JSON (no explanations, no markdown, no backticks).
Format: 
[
  {
    "title": "Course Title",
    "provider": "Udemy",
    "url": "https://...",
    "tags": ["tag1","tag2"],
    "level": "Beginner"
  }
]`;

    const model = genAI.getGenerativeModel({ model: `gemini-1.5-flash-latest` });
    const result = await model.generateContent(prompt);

    let text = await result.response.text();

    // 🔑 Strip Markdown fences (```json ... ```)
    text = text.replace(/```json|```/g, "").trim();

    let courses = [];
    try {
      courses = JSON.parse(text);
    } catch (err) {
      console.error("❌ JSON Parse Error after cleanup:", err, "Raw text:", text);
      courses = [];
    }

    const cleanCourses = courses.map((c) => ({
      title: c.title || "Untitled",
      provider: c.provider || "Unknown",
      url: c.url || "#",
      tags: c.tags || [],
      level: c.level || "N/A",
    }));

    res.json(cleanCourses);
  } catch (err) {
    console.error("❌ Course Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};
