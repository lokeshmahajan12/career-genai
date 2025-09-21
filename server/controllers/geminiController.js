// server/controllers/geminiController.js
import axios from "axios";
import fs from "fs";
import path from "path";

// 🔹 Save errors to log
function saveErrorLog(err) {
  const logPath = path.join(process.cwd(), "gemini_errors.log");
  const logData = `${new Date().toISOString()} - ${JSON.stringify(err)}\n`;
  fs.appendFileSync(logPath, logData, "utf8");
}

// 🔹 Retry helper for Gemini API
async function callGeminiWithRetry(endpointUrl, body, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.post(endpointUrl, body, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 429) {
        const customErr = {
          response: {
            status: 429,
            data: {
              success: false,
              error:
                "⚠️ Gemini API quota exceeded. Please try again later or use a new API key.",
            },
          },
        };
        saveErrorLog(customErr.response.data);
        throw customErr;
      }

      if (err.response?.status === 503 && i < retries - 1) {
        console.warn(`⚠️ Gemini overloaded. Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        saveErrorLog(err.response?.data || err.message);
        throw err;
      }
    }
  }
}

// 🔹 Controller function
export const generateGeminiContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const apiRes = await callGeminiWithRetry(endpointUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const output =
      apiRes?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

    res.json({ success: true, output });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);

    if (err.response?.status === 429) {
      return res.status(429).json(err.response.data);
    }

    res
      .status(err.response?.status || 500)
      .json({
        success: false,
        error: err.response?.data || err.message,
      });
  }
};
