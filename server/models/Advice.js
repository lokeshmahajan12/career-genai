import mongoose from 'mongoose';

const adviceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    summary: String,
    roadmap: [
      {
        title: String,
        weeks: Number,
        skills: [String],
        resources: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Advice', adviceSchema);
