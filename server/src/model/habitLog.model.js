const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "missed"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate log for same habit same date
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("HabitLog", habitLogSchema);