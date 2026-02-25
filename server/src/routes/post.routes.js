import { Router } from 'express'
import Protected from '../middleware/auth.middleware.js'
import { addComments, createPost, deletePost, feed, toggleLike } from '../controllers/post.controller.js'

const router = Router()

router.use(Protected)

router.post('/', createPost)
router.get('/', feed)
router.post('/:id/like', toggleLike)
router.post('/:id/comment', addComments)
router.delete('/:id', deletePost)

export default router
