import habitLogModel from "../model/habitLog.model.js";
import catchAsync from "../utils/catchAsync.js"

// Weekly Analytics
const getWeeklyStats = catchAsync(async (req, res, next) => {
    const start = new Date()
    start.setDate(start.getDate() - 7);

    const stats = await habitLogModel.aggregate(
        [
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: start },
                    status: "completed"
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" },
                    count: { $sum: 1 },
                }
            }

        ]
    )

    res.status(200).json({
        status: "success",
        data: stats,
    });
})

// Monthly Analytics

const getMonthlyStats = catchAsync(async (req, res) => {
    const start = new Date()
    start.getMonth(start.getMonth() - 1);

    const stats = await habitLogModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                date: { $gte: start },
                status: "completed"
            },
        },
        {
            $group: {
                _id: { $dayOfMonth: "$date" },
                count: { $sum: 1 }
            }
        }
    ])

    res.status(200).json({
        status: "success",
        data: stats,
    });
})

// Heatmap Data

const getHeatmap = catchAsync(async (req, res) => {
    const data = await habitLogModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                status: "completed",
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    day: { $dayOfMonth: "$date" },
                },
                count: { $sum: 1 }
            },
        }
    ])

    res.status(200).json({
        status: "success",
        data,
    });
})
export { getWeeklyStats, getMonthlyStats,getHeatmap }