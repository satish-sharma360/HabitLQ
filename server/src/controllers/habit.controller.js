import habitModel from "../model/habit.model.js";
import habitLogModel from "../model/habitLog.model.js";
import userModel from "../model/user.model.js";
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
    const habitId = req.params.id;
    const userId = req.user._id;


    if (!await userModel.findById(userId)) {
        return next(new AppError("User not found", 404));
    }

    if (!await habitModel.findById(habitId)) {
        return next(new AppError("Habit not found", 404));
    }

    const habit = await habitModel.findOneAndUpdate(
        { _id: habitId, userId: userId },
        req.body,
        { returnDocument: 'after', runValidators: true }
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
    const habit = await habitModel.findOne({
        _id: req.params.habbitId,   // fixed typo: habbitId → habitId
        userId: req.user._id
    });

    if (!habit) {
        return next(new AppError("Habit not found", 404));
    }

    const now = new Date();


    // ✅ 1. Check if today is an allowed repeat day
    // getDay(): 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // fixed order
    const todayDay = dayMap[now.getDay()];

    if (habit.repeatDays && habit.repeatDays.length > 0) {
        if (!habit.repeatDays.includes(todayDay)) {
           return res.status(400).json({message:`This habit is not scheduled for ${todayDay}`}); 
        }
    }

    // ✅ 2. Check time window if reminderTime is set (e.g "07:00")
    // ✅ 2. Check time window if reminderTime is set (e.g "07:00")
    if (habit.reminderTime) {
        const [reminderHour, reminderMinute] = habit.reminderTime.split(":").map(Number);
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const reminderMinutes = reminderHour * 60 + reminderMinute;

        // Allow completion from reminder time until end of day (midnight)
        const windowEndMinutes = 24 * 60; // 1440 — end of day

        if (nowMinutes < reminderMinutes) {
            return res.status(400).json({message:`This habit can only be completed after ${habit.reminderTime}`}); 
        }
    }

    // ✅ 3. Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // local midnight, consistent with above

    const existingLog = await habitLogModel.findOne({
        habitId: habit._id,
        date: today,
    });

    if (existingLog) {
        return res.status(400).json({message:"Habit already marked today"});
    }

    // Create log
    await habitLogModel.create({
        habitId: habit._id,
        userId: req.user._id,
        date: today,
        status: "completed"
    });

    // Update streak
    habit.currentStreak += 1;
    habit.totalCompletions += 1;

    if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
    }

    await habit.save();

    await addXP(req.user._id, 10);
    await checkStreakBonus(req.user._id, habit.currentStreak); // fixed: req.user_id → req.user._id
    await checkBadges(req.user._id, habit.currentStreak);

    res.status(200).json({
        status: "success",
        message: "Habit completed",
        currentStreak: habit.currentStreak,
    });
});

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

    const allLogs = await habitLogModel.find({ habitId: req.params.id });

    const logs = await habitLogModel.find({
        habitId: req.params.habitId,
        userId: req.user._id
    }).sort({ date: -1 });


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