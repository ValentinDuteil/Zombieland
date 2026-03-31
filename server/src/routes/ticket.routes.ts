// Route definitions for tickets
import { getAllprices, updateTicketPrice } from '../controllers/ticket.controller.js'
// Import Router from Express to create a router
import { Router } from 'express'
import { checkToken } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { updateTicketSchema } from '../schemas/ticket.schema.js'

const router = Router()

router.get('/',  getAllprices)
router.patch('/price', checkToken, checkRole("ADMIN"), validate(updateTicketSchema), updateTicketPrice)

export default router