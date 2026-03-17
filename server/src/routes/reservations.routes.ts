// Route definitions for reservations

// Import Router from Express to create a router
import { Router } from 'express'
// Import function from the controller
import { createReservation, deleteReservation, getReservations } from '../controllers/reservations.controller.js'
import { checkToken } from '../middlewares/auth.middleware.js'

// Create an router Express
const router = Router()

// When someone calls GET /api/reservations execute getReservations
router.get('/', getReservations)
// When someone calls POST /api/reservations, execute createReservation
router.post('/', createReservation)
//When someone calls DELETE /api/reservations/:id, execute deleteReservation
router.delete('/:id', checkToken, deleteReservation)

export default router