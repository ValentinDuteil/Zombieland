// Business logic for reservations : handles requests and responses

import type { Request, Response } from "express";
// Talk to the db
import { prisma } from '../lib/prisma.js'
// Import the validation schema
import { createReservationSchema } from "../schemas/reservation.schema.js";
import { checkToken } from "../middlewares/auth.middleware.js";

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
                id_USER: req.user?.id ?? 1, 
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

// Cancel a reservation with J-10 rule
export const deleteReservation = async (req: Request, res: Response) => {
    try {
        // Get the id from the URL parameters and convert it to a number
        const reservationParam = parseInt(req.params.id as string);

        // Check if the id is not a valid number
        if (isNaN(reservationParam)) {
            // Return a 400 Bad Request error if the id is invalid
            return res.status(400).json({
                error: "Reservation non trouvée"
            })
        };

        // Check if the user is authenticated
        if (!req.user) {
            // Return a 401 Unauthorized error if no user is found
            return res.status(401).json({
                error: "L'utilisateur n'existe pas "
            })
        }

        // Get the connected member's id from the JWT token
        const memberId = req.user.id;

        // Search the database for the reservation with this id
        const findReservation = await prisma.reservation.findUnique({
            where: {
                id_RESERVATION: reservationParam
            }
        })

        // Check if the reservation was not found in the database
        if (findReservation === null) {
            // Return a 404 Not Found error
            return res.status(404).json({
                error: "La réservation n'existe pas"
            })
        }

        // Check if the reservation belongs to the connected member
        if (findReservation.id_USER !== memberId) {
            // Return a 403 Forbidden error if it's not their reservation
            return res.status(403).json({
                error: "Cette réservation ne vous appartient pas"
            })
        }

        // Calculate the number of days between now and the reservation date
        const dateNow = new Date();
        const dateReservation = new Date(findReservation.date);
        const calculDate = dateReservation.getTime() - dateNow.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const resultDate = Math.round(calculDate / oneDay)

        // Check if the reservation is within 10 days (J-10 rule)
        if (resultDate <= 10) {
            // Return a 400 error if cancellation is too late
            return res.status(400).json({
                error: "Annulation impossible"
            })
        }

        // All checks passed: update the reservation status to CANCELLED
        await prisma.reservation.update({
            where: {
                id_RESERVATION: reservationParam,
            },
            data: {
                status: "CANCELLED"
            }
        })

        // Return a 200 success message
        return res.status(200).json({
            message: "Votre annulation a bien été prise en compte"
        })

    } catch (error) {
        // Log the error for debugging
        console.error(error)
        // Return a 500 Internal Server Error for unexpected errors
        return res.status(500).json({
            error: "Erreur lors de l'annulation de la réservation"
        })
    }
}