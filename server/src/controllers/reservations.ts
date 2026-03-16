// Business logic for reservations : handles requests and responses

import type { Request, Response } from "express";
// Talk to the db
import { prisma } from '../lib/prisma.js'
// Import the validation schema
import { createReservationSchema } from "../schemas/reservation.js";

// Retrieves all reservations for the logged-in member
export const getReservations = async (req: Request, res: Response) => {
    try {
        // Query the db to retrieve all reservations
        const reservations = await prisma.reservation.findMany()
        // Return reservations with a 200 status (success)
        res.status(200).json(reservations)
    } catch {
        // In case of server error, return a 500 status
        res.status(500).json({ message: 'Internal server error' })
    }
}

// Create a new reservation
export const createReservation = async (req: Request, res: Response) => {
    try {
        // Validate the received data with Zod
        const result = createReservationSchema.safeParse(req.body)

        // If the data is invalid, return a 400 error
        if (!result.success) {
            res.status(400).json({ message: result.error.issues })
            return
        }

        const { nb_tickets, date, id_TICKET } = result.data

        // Create the reservation in the database
        const reservation = await prisma.reservation.create({
            data: {
                nb_tickets,
                date: new Date(date),
                id_TICKET,
                id_USER: 1,
                total_amount: 0,
            }
        })

        // Return the created reservation with a 201 status
        res.status(201).json(reservation)

    } catch (error) {
        console.error(error)
        // In case of server error, return a 500 status
        res.status(500).json({ message: 'Internal server error' })
    }
}