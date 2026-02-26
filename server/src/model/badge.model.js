import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredStreak: {
      type: Number,
      default: 0,
    },
    requiredXP: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Badge", badgeSchema);