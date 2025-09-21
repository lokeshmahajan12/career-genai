import Course from "../models/Course.js";
import Profile from "../models/Profile.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Gemini AI-based course recommendation
export const recommendCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ user: userId }).lean();
    if (!profile) return res.status(400).json({ message: "Complete profile first." });

    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

    const prompt = `
      Suggest top 6 online courses (title, provider, url, tags, level) 
      for a student with skills: ${profile.skills?.join(", ")} 
      aiming for goals: ${profile.goals}. 
      Return JSON array: [{ "title":"", "provider":"", "url":"", "tags":[""], "level":"" }]
    `;

    const model = genAI.getGenerativeModel({ model: "chat-bison-001" }); // adjust model name
    const result = await model.generateContent(prompt);

    let courses;
    try {
      courses = JSON.parse(result.response?.text() || "[]");
    } catch {
      courses = [];
    }

    res.json(courses);
  } catch (err) {
    console.error("Gemini Courses Error:", err);
    res.status(500).json({ error: "Course recommendation failed" });
  }
};

// Optional: seed courses (with embeddings if needed)
export const seedCourses = async (req, res) => {
  const samples = [
    { title: "Full-Stack Web Dev with MERN", provider: "Udemy", url: "https://udemy.com/mern-course", tags: ["mern","fullstack","node","react"], level: "intermediate" },
    { title: "Data Structures & Algorithms", provider: "Coursera", url: "https://coursera.org/dsa", tags: ["dsa","algorithms","coding"], level: "intermediate" },
    { title: "System Design Basics", provider: "Educative", url: "https://educative.io/system-design", tags: ["system design","scalability"], level: "advanced" },
    { title: "SQL for Data Analysis", provider: "Khan Academy", url: "https://khanacademy.org/sql", tags: ["sql","database"], level: "beginner" },
    { title: "Intro to Machine Learning", provider: "Coursera", url: "https://coursera.org/ml", tags: ["ml","python","ai"], level: "beginner" },
    { title: "Prompt Engineering", provider: "DeepLearning.AI", url: "https://deeplearning.ai/short-courses/prompt-engineering/", tags: ["genai","prompt"], level: "intermediate" }
  ];

  for (const c of samples) {
    await Course.findOneAndUpdate({ title: c.title }, c, { upsert: true });
  }

  res.json({ message: "Seeded courses" });
};
