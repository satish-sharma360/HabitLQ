import habitLogModel from "../model/habitLog.model.js";


const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const authMarkMissed = async (userId) => {
    const now = new Date()

    const todayDay = dayMap[now.getDay()]

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0);

    // get All habits for this user Schedules today

    const habits = await habitLogModel.find({
        userId,
        repeatDays: today,
        reminderTime: { $exists: true, $ne: null }
    })

    for (const habit of habits) {
        const [remainderHour, reminderMinute] = habit.reminderTime.split(":").map(Number)

        const windowEnd = new Date()
        windowEnd.setHours(remainderHour, reminderMinute, 0, 0)
        windowEnd.setMinutes(windowEnd.getTime() + 30 * 60 * 1000)

        // skip if window hasn't passed yet
        if (now <= windowEnd) continue;

        // check if already logged today
        const existing = await habitLogModel.findOne({
            habitId: habit._id,
            data: today,
        })

        if (existing) continue;

        await habitLogModel.create({
            habitId: habit._id,
            userId: habit.userId,
            date: today,
            status: "missed",
        })

        habit.currentStreak = 0;
        await habit.save();

        console.log(`❌ Auto-missed: ${habit.name}`);
    }
}

const autoMissMiddleware = async (req,res,next) =>{
    try {
        if (req.user?._id) {
            await authMarkMissed(req.user._id)
        }
    } catch (error) {
        console.error("Auto-miss middleware error:", err.message);
    }
    next()
}
export default autoMissMiddleware