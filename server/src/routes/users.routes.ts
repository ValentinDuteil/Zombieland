// Route definitions for users

// Import Router from Express to create a router
import { Router } from 'express'
// Import function from the controller
import { getAllUsers, getProfile, updateProfile, deleteProfile } from '../controllers/users.controller.js'
import { checkToken } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'

// Create an router Express
const router = Router()

router.get('/', checkToken, checkRole('ADMIN'), getAllUsers)
router.get('/:id/profile', checkToken, getProfile)
router.patch('/:id/profile', checkToken, updateProfile)
router.delete('/:id', checkToken, deleteProfile)

export default router