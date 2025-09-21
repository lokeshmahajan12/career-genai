import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String }],
  interests: [{ type: String }],
  experience: { type: String },
  education: { type: String },
  location: { type: String },
  industry: { type: String },
  analysis: {
    skills: [{ type: String }],
    jobs: [
      {
        title: String,
        company: String,
        matchScore: Number,
      },
    ],
    courses: [
      {
        name: String,
        link: String,
      },
    ],
    careerSuggestions: [
      {
        title: String,
        reason: String,
      },
    ],
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
