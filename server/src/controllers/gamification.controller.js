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