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

export const ReservationSchema = z.object({
    // Number of tickets, minimum 1
    nb_tickets: z.number(),

    // Reservation date
    date: z.string(),

    // Ticket identifier
    id_TICKET: z.number(),
    // Status
    status: z.enum(["CONFIRMED", "CANCELLED"]).default("CONFIRMED")
})

    export const AdminCreateReservationSchema = z.object({
    // id for user (admin)
    id_USER: z.number(),

    // Number of tickets, minimum 1
    nb_tickets: z.number().min(1),

    // Reservation date
    date: z.string(),

    // Ticket identifier
    id_TICKET: z.number()
    })

export const UpdateReservationSchema = ReservationSchema.partial()

// We automatically generate the TypeScript type from the schema
export type CreateReservationInput = z.infer<typeof createReservationSchema>
export type UpdateReservationInput = z.infer<typeof UpdateReservationSchema>
export type AdminCreateReservationInput = z.infer<typeof AdminCreateReservationSchema>