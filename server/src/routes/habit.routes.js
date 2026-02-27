import { Router } from 'express'
import Protected from '../middleware/auth.middleware.js'
import { completeHabit, createhabit, deleteHabit, getHabitLogs, getHabits, getsingleHabit, missHabit, updateHabit } from '../controllers/habit.controller.js'
import autoMissMiddleware from '../middleware/autoMiss.middleware.js'

const router = Router()

router.use(Protected , autoMissMiddleware)

router.post('/', createhabit)
router.get('/', getHabits)
router.get('/:id', getsingleHabit)
router.patch('/:id', updateHabit)
router.delete('/:id', deleteHabit)


router.post('/:habbitId/completed', completeHabit)
router.post('/:habitId/miss', missHabit)
router.get('/:habitId/logs', getHabitLogs)


export default router
