import XP_RULES from "../config/xp_rule.js";
import badgeModel from "../model/badge.model.js";
import postModel from "../model/post.model.js";
import userModel from "../model/user.model.js"

const addXP = async (userId, xpAmount) => {
    const user = await userModel.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    user.xp += xpAmount;

    let levelThreshold = user.level * 100;

    // handle multiple level-ups
    while (user.xp >= levelThreshold) {
        user.xp -= levelThreshold;
        user.level += 1;

        // auto social post for level up

        await postModel.create({
            userId: user._id,
            type: 'achievement',
            content: `🎉 I just reached Level ${user.level}!`
        })

        levelThreshold = user.level * 100;
    }

    await user.save()
    return user;
}

const checkStreakBonus = async (userId, currentStreak) => {
    let bonusXP = 0;
    if (currentStreak === 3) bonusXP = XP_RULES.STREAK_3;
    if (currentStreak === 7) bonusXP = XP_RULES.STREAK_7;
    if (currentStreak === 30) bonusXP = XP_RULES.STREAK_30;

    if (bonusXP > 0) {
        await addXP(userId, bonusXP);

        await postModel.create({
            userId,
            type: "milestone",
            content: `🔥 ${currentStreak}-day streak achieved!`,
        })
    }
}

const checkBadges = async (userId, currentStreak) => {
    const user = await userModel.findById(userId).populate("badges")

    const unlockedbadgeIds = await user.badges.map((b) => b._id.toString());

    const allBadges = await badgeModel.find()

    for (const badge of allBadges) {
        if (
            (badge.requiredStreak && currentStreak >= badge.requiredStreak)
            ||
            (badge.requiredXP && user.xp >= badge.requiredXP)
        ) {
            if (!unlockedbadgeIds.includes(badge._id.toString())) {
                user.badges.push(badge._id)

                await Post.create({
                    userId,
                    type: "achievement",
                    content: `🏆 Unlocked Badge: ${badge.name}`,
                });
            }
        }
    }
    await user.save();
}

export { addXP, checkStreakBonus , checkBadges}