import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    location: { type: String, default: "" },
    industry: { type: String, default: "" },
    aiResponse: { type: Object, default: {} }, // AI-generated content
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
