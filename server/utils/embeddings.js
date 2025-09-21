import dotenv from "dotenv";

dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const getEmbedding = async (text) => {
  if (!genAI) return Array(1536).fill(0); // fallback

  try {
    const model = genAI.getGenerativeModel({ model: "textembedding-gecko-001" });
    const result = await model.embedContent(text);
    return result.embedding;
  } catch (err) {
    console.error("Embedding generation failed:", err);
    return Array(1536).fill(0); // fallback
  }
};
