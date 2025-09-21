import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: String,
    provider: String,
    url: String,
    tags: [String],
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    embedding: { type: [Number], default: [] },
    reviews: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

courseSchema.index({ tags: 1 });
export default mongoose.model('Course', courseSchema);
