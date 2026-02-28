import { Router } from "express";
import Protected from "../middleware/auth.middleware.js";
import { askAI, getAIHistory } from "../controllers/ai.controller.js";

const router = Router()

router.use(Protected)

router.post('/ask' , askAI)
router.get('/history' , getAIHistory)

export default router;