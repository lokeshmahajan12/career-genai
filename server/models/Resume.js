import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    text: { type: String },
    embedding: { type: [Number] }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
