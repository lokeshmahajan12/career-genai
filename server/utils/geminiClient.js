import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function for chat or JSON output
export async function createChat(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Gemini mostly returns text
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    return null;
  }
}
