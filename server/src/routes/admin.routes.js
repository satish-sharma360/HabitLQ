import {Router} from 'express'
import Protected, { getAdmin } from '../middleware/auth.middleware.js';
import { deleteUsers, getAllUsers, verifypost } from '../controllers/admin.controller.js';

const router = Router();

router.use(Protected);
router.use(restrictTo("admin"));

router.get("/users", getAdmin, getAllUsers);
router.delete("/user/:id", getAdmin, deleteUsers);
router.patch("/verify-post/:postId", getAdmin, verifypost);

module.exports = router;