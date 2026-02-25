import {Router} from 'express'
import { getMe, loginUser, logOut, RegisterUser, updateProfile } from '../controllers/user.controller.js'
import Protected from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register' , RegisterUser)
router.post('/login' , loginUser)
router.post('/logout' , logOut)
router.post('/profile', Protected , getMe)
router.post('/update-profile' , updateProfile)

export default router
