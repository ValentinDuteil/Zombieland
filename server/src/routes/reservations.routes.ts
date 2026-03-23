// Route definitions for reservations

// Import Router from Express to create a router
import { Router } from 'express'
// Import function from the controller
import { createReservation, deleteReservation, getAllReservations, getMyReservations, updateReservation } from '../controllers/reservations.controller.js'
import { checkToken } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'

import { validate } from '../middlewares/validate.middleware.js'
import { createReservationSchema, UpdateReservationSchema } from '../schemas/reservation.schema.js'

// Create an router Express
const router = Router()

// when someone calls GET /api/reservations/me, execute getMyReservations (before /:id)
router.get('/me', checkToken, getMyReservations)
// When someone calls GET /api/reservations execute getAllReservations (admin only)
router.get('/', checkToken, checkRole("ADMIN"), getAllReservations)
// When someone calls POST /api/reservations, execute createReservation
router.post('/', checkToken, validate(createReservationSchema), createReservation)
//When someone calls DELETE /api/reservations/:id, execute deleteReservation
router.delete('/:id', checkToken, deleteReservation)
//When someone calls PATCH /api/reservations/:id, execute updateReservation
router.patch('/:id', checkToken, checkRole("ADMIN"), validate(UpdateReservationSchema), updateReservation)

export default router