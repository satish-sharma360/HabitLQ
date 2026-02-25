const mongoose = require("mongoose");

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

module.exports = mongoose.model("Badge", badgeSchema);