import { Router } from 'express'
import Protected from '../middleware/auth.middleware.js'
import { completeHabit, createhabit, deleteHabit, getHabitLogs, getHabits, getsingleHabit, missHabit, updateHabit } from '../controllers/habit.controller.js'

const router = Router()

router.use(Protected)

router.post('/', createhabit)
router.get('/', getHabits)
router.get('/:id', getsingleHabit)
router.patch('/:id', updateHabit)
router.delete('/:id', deleteHabit)


router.delete('/:habbitId/completed', completeHabit)
router.delete('/:habbitId/miss', missHabit)
router.delete('/:habbitId/logs', getHabitLogs)


export default router
