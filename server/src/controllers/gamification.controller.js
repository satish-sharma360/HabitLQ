import badgeModel from "../model/badge.model.js";
import userModel from "../model/user.model.js"
import catchAsync from "../utils/catchAsync.js"

const getLeaderboard = catchAsync(async (req, res, next) => {
    const users = await userModel.find()
        .select("name level xp")
        .sort({ level: -1, xp: -1 })
        .limit(10)

    res.status(200).json({
        status: "success",
        data: users,
    });
})

const getProfileStats = catchAsync(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
        .select("name level xp streak badges")
        .populate("badges")

    res.status(200).json({
        status: "success",
        data: user
    });
})

const getAllBadges = catchAsync(async (req, res, next) => {

    const user = await userModel.findById(req.user._id);

    const badges = await badgeModel.find();

    const formatted = badges.map((b) => ({
        ...b.toObject(),
        unlocked: user.badges.includes(b._id)
    }))

    res.status(200).json({
        status: "success",
        results: formatted.length,
        data: formatted,
    });
})
export { getLeaderboard, getProfileStats ,getAllBadges}