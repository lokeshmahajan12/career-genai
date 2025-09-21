import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

async function extractTextFromPDF(filePath) {
  try {
    // Absolute path बनव (project root पासून safe resolve)
    const absolutePath = path.resolve(process.cwd(), filePath);

    // File अस्तित्वात आहे का तपास
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

// Example usage (uploads/resume.pdf relative to project root)
extractTextFromPDF("server/uploads/resume.pdf")
  .then((text) => {
    console.log("✅ Extracted Resume Text:\n", text);
  })
  .catch((err) => {
    console.error("Error while extracting text:", err.message);
  });
