import { Router } from 'express'
import { getMaxTickets, updateMaxTickets } from '../controllers/setting.controller.js'
import { checkToken } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { updateSettingSchema } from '../schemas/setting.schema.js'

const router = Router()

// Get the current daily ticket cap (public)
router.get('/', getMaxTickets)
// Update the daily ticket cap (admin only)
router.patch('/', checkToken, checkRole("ADMIN"), validate(updateSettingSchema), updateMaxTickets)

export default router