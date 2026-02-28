import { Router } from "express";
import Protected from "../middleware/auth.middleware.js";
import { getHeatmap, getMonthlyStats, getWeeklyStats } from "../controllers/analytics.controller.js";

const router = Router();

router.use(Protected);

router.get("/weekly", getWeeklyStats);
router.get("/monthly", getMonthlyStats);
router.get("/heatmap", getHeatmap);

export default router;