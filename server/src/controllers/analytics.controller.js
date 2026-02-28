import habitLogModel from "../model/habitLog.model.js";
import catchAsync from "../utils/catchAsync.js"
import mongoose from "mongoose";

// Weekly Analytics
const getWeeklyStats = catchAsync(async (req, res, next) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6); // last 7 days inclusive of today

    const stats = await habitLogModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id), // ✅ fix: cast to ObjectId so $match works
                date: { $gte: start },
                status: "completed",
            },
        },
        {
            $group: {
                _id: { $dayOfWeek: "$date" }, // 1=Sun … 7=Sat (MongoDB convention)
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ status: "success", data: stats });
});

// Monthly Analytics — last 30 days, grouped by day-of-month
const getMonthlyStats = catchAsync(async (req, res, next) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 29); // ✅ fix: was start.getMonth(…) which does nothing

    const stats = await habitLogModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id), // ✅ fix: cast to ObjectId
                date: { $gte: start },
                status: "completed",
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // ✅ full date string so frontend can map easily
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ status: "success", data: stats });
});

// Heatmap — all time, one entry per calendar day
const getHeatmap = catchAsync(async (req, res, next) => {
    const data = await habitLogModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id), // ✅ fix: cast to ObjectId
                status: "completed",
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // ✅ flat string instead of nested {year,month,day} object — easier for frontend
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ status: "success", data });
});

export { getWeeklyStats, getMonthlyStats,getHeatmap }