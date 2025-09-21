import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

/**
 * Extract text from PDF file
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(filePath) {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const dataBuffer = fs.readFileSync(absolutePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    console.error("❌ PDF extraction error:", err.message);
    throw err;
  }
}
