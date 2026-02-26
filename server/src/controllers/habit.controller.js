import habitModel from "../model/habit.model.js";
import habitLogModel from "../model/habitLog.model.js";
import { addXP, checkBadges, checkStreakBonus } from "../service/gamification.service.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js"

const createhabit = catchAsync(async (req, res, next) => {
    const { name, category, reminderTime, repeatDays } = req.body;

    if (!name) {
        return next(AppError('Habit name is required', 400))
    }
    if (!req.user._id) {
        return next(AppError('User not Login', 400))
    }

    const habit = await habitModel.create({
        userId: req.user._id,
        name,
        category,
        reminderTime,
        repeatDays
    })

    res.status(201).json({
        status: "success",
        data: habit,
    });
})

const getHabits = catchAsync(async (req, res, next) => {

    const habits = await habitModel.find({ userId: req.user._id })

    res.status(200).json({
        status: "success",
        results: habits.length,
        data: habits,
    });
})

const getsingleHabit = catchAsync(async (req, res, next) => {
    const habit = await habitModel.findOne({
        _id: req.params.id,
        userId: req.user._id
    })

    if (!habit) {
        return next(new AppError("Habit not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: habit,
    });
})

const updateHabit = catchAsync(async (req, res, next) => {
    const habit = await habitModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
    )

    if (!habit) {
        return next(new AppError("Habit not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: habit,
    });
})

const deleteHabit = catchAsync(async (req, res, next) => {
    const habit = await habitModel.findOneAndDelete(
        { _id: req.params.id, userId: req.user._id }
    )

    if (!habit) {
        return next(new AppError("Habit not found", 404));
    }
    await habitLogModel.deleteMany({ habitId: habit._id });

    res.status(200).json({
        status: "success",
        message: "Habit deleted successfully",
    });
})

const completeHabit = catchAsync(async (req, res, next) => {
    const habit = await habitModel.findOne({ _id: req.params.habbitId, userId: req.user._id })

    if (!habit) {
        return next(new AppError("Habit not found", 404));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLog = await habitLogModel.findOne({
        habitId: habit._id,
        date: today,
    })

    if (existingLog) {
        return next(new AppError("Habit already marked today", 400));
    }

    // createLog
    await habitLogModel.create({
        habitId: habit._id,
        userId: req.user._id,
        date: today,
        status: "completed"
    });

    // update Strick
    habit.currentStreak += 1;
    habit.totalCompletions += 1;

    if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
    }

    await habit.save();

    await addXP(req.user._id, 10);
    await checkStreakBonus(req.user_id, habit.currentStreak)
    await checkBadges(req.user._id , habit.currentStreak)
    
    res.status(200).json({
        status: "success",
        message: "Habit completed",
        currentStreak: habit.currentStreak,
    });

})

const missHabit = catchAsync(async (req, res, next) => {
    const habit = await habitModel.findOne({
        _id: req.params.habitId,
        userId: req.user._id,
    })

    if (!habit) {
        return next(new AppError("Habit not found", 404));
    }

    habit.currentStreak = 0;
    await habit.save()

    res.status(200).json({
        status: "success",
        message: "Streak reset",
    });
})

const getHabitLogs = catchAsync(async (req, res, next) => {
    const logs = await habitLogModel.find({
        habitId: req.params._id,
        userId: req.user._id
    }).sort({ date: -1 })

    res.status(200).json({
        status: "success",
        results: logs.length,
        data: logs,
    });
})

export {
    createhabit,
    getHabits,
    getsingleHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    missHabit,
    getHabitLogs
}