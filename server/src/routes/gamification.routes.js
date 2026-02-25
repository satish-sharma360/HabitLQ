import { Router } from "express";
import Protected from "../middleware/auth.middleware.js";
import { getAllBadges, getLeaderboard, getProfileStats } from "../controllers/gamification.controller.js";

const router = Router()

router.use(Protected)

router.get('/profile' , getProfileStats)
router.get('/badges' , getAllBadges)
router.get('/leaderboard' , getLeaderboard)

export default router;