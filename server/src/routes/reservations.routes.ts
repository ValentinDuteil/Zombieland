// Route definitions for reservations

// Import Router from Express to create a router
import { Router } from 'express'
// Import function from the controller
import { createReservation, deleteReservation, getAllReservations, getAvailabilities, getMyReservations, updateReservation } from '../controllers/reservations.controller.js'
import { checkToken } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'

import { validate } from '../middlewares/validate.middleware.js'
import { AdminCreateReservationSchema, createReservationSchema, UpdateReservationSchema } from '../schemas/reservation.schema.js'

// Create an router Express
const router = Router()

// when someone calls GET /api/reservations/me, execute getMyReservations (before /:id)
router.get('/me', checkToken, getMyReservations)
// When someone calls GET /api/reservations execute getAllReservations (admin only)
router.get('/', checkToken, checkRole("ADMIN"), getAllReservations)
// When someone calls GET /api/reservations/availabilities execute getAvailabilities
router.get('/availabilities', getAvailabilities)
// When someone calls POST /api/admin execute createReservation
router.post('/admin', checkToken, checkRole('ADMIN'), validate(AdminCreateReservationSchema), createReservation)
// When someone calls POST /api/reservations, execute createReservation
router.post('/', checkToken, validate(createReservationSchema), createReservation)
//When someone calls DELETE /api/reservations/:id, execute deleteReservation
router.delete('/:id', checkToken, deleteReservation)
//When someone calls PATCH /api/reservations/:id, execute updateReservation
router.patch('/:id', checkToken, checkRole("ADMIN"), validate(UpdateReservationSchema), updateReservation)

export default router