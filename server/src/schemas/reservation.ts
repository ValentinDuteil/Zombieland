// Zod validation schemas for reservations

import { z } from 'zod'

// Schema for creating a reservation
export const createReservationSchema = z.object({
    // Number of tickets, minimum 1
    nb_tickets: z.number().min(1),

    // Reservation date
    date: z.string(),

    // Ticket identifier
    id_TICKET: z.number()
})

// We automatically generate the TypeScript type from the schema
export type CreateReservationInput = z.infer<typeof createReservationSchema>