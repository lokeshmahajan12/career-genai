import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], default: [] },
  },
  { timestamps: true }
);

messageSchema.index({ user: 1, createdAt: -1 });
export default mongoose.model('Message', messageSchema);
