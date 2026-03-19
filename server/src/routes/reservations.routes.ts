// Route definitions for reservations

// Import Router from Express to create a router
import { Router } from 'express'
// Import function from the controller
import { createReservation, deleteReservation, getAllReservations, getMyReservations } from '../controllers/reservations.controller.js'
import { checkToken } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'

// Create an router Express
const router = Router()

// when someone calls GET /api/reservations/me, execute getMyReservations (before /:id)
router.get('/me', checkToken, getMyReservations)
// When someone calls GET /api/reservations execute getAllReservations (admin only)
router.get('/', checkToken, checkRole("ADMIN"), getAllReservations)
// When someone calls POST /api/reservations, execute createReservation
router.post('/', checkToken, createReservation)
//When someone calls DELETE /api/reservations/:id, execute deleteReservation
router.delete('/:id', checkToken, deleteReservation)

export default router