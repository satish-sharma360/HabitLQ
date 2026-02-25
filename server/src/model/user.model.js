const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },
        xp: {
            type: Number,
            default: 0,
            min: 0,
        },
        streak: {
            type: Number,
            default: 0,
            min: 0,
        },
        badges: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Badge",
            },
        ],
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);