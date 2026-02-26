import aichatModel from "../model/aichat.model.js";
import habitModel from "../model/habit.model.js";
import habitLogModel from "../model/habitLog.model.js";
import { askCoach } from "../service/ai.service.js";
import catchAsync from "../utils/catchAsync.js"

const askAI = catchAsync(async (req, res, next) => {
    const { message } = req.body;

    const habbits = await habitModel.find({ userId: req.user._id })
    const logs = await habitLogModel.find({ userId: req.user._id })

    const reply = await askCoach(
        req.user,
        habbits,
        logs,
        message
    )

    res.status(200).json({
        status: "success",
        reply,
    });
})

const getAIHistory = catchAsync(async (req, res, next) => {
    const history = await aichatModel.find({
        userId: req.user._id
    }).sort({ createdAt: -1 }).limit(20)

    res.status(200).json({
        status: "success",
        results: history.length,
        data: history,
    });
})
export { askAI ,getAIHistory}

