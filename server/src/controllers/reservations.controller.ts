// Business logic for reservations : handles requests and responses

import type { Request, Response, NextFunction } from "express";
// Talk to the db
import { prisma } from '../lib/prisma.js'
// Import the validation schema
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from "../utils/AppError.js";

// Retrieves all reservations for admin
export const getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
    // Query the db to retrieve all reservations
    const reservations = await prisma.reservation.findMany()
    // Return reservations with a 200 status (success)
    res.status(200).json(reservations)
}
// Retrieves reservation for the logged-in member
export const getMyReservations = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new UnauthorizedError("L'utilisateur n'existe pas")
    }
    const reservations = await prisma.reservation.findMany({
        where: { id_USER: req.user.id }
    })
    res.status(200).json(reservations)
}

// Create a new reservation
export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    // Check if the user is authenticated
    if (!req.user) throw new UnauthorizedError('Accès refusé');

    // Destructure the request body to get the reservation details
    // id_USER is optional: only provided when an admin creates for a member
    const { nb_tickets, date, id_TICKET, id_USER } = req.body;

    // If id_USER is provided, it means an admin is creating a reservation for a member
    // We need to verify that this member actually exists in the database
    if (id_USER) {
        // Search for the member in the database
        const findUser = await prisma.user.findUnique({ where: { id_USER } });
        // If the member doesn't exist, return a 404 error
        if(findUser === null){
            // Return a 404 Not Found error
            throw new NotFoundError('Utilisateur non trouvé')
        }
    } ;
    // Check if the ticket exists in the database (for both admin and member)
    const ticket = await prisma.ticket.findUnique({ where: { id_TICKET } });
    // If the ticket doesn't exist, return a 404 error
    if(ticket === null){
        // Return a 404 Not Found error
        throw new NotFoundError('Ticket non trouvé')
    };

// Create the reservation in the database
const reservation = await prisma.reservation.create({
    data: {
        nb_tickets,
        date: new Date(date),
        id_TICKET,
        id_USER: id_USER || req.user.id,
        total_amount: 0,
    }
});

// Return the created reservation with a 201 status
res.status(201).json(reservation)
};

// Cancel a reservation with J-10 rule
export const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    // Get the id from the URL parameters and convert it to a number
    const reservationParam = parseInt(req.params.id as string);

    // Check if the id is not a valid number
    if (isNaN(reservationParam)) {
        // Return a 400 Bad Request error if the id is invalid
        throw new BadRequestError("Réservation non trouvée")
    };

    // Check if the user is authenticated
    if (!req.user) {
        // Return a 401 Unauthorized error if no user is found
        throw new UnauthorizedError("L'utilisateur n'existe pas")
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
        throw new NotFoundError("La réservation n'existe pas")
    }

    // Check if the reservation belongs to the connected member
    if (findReservation.id_USER !== memberId) {
        // Return a 403 Forbidden error if it's not their reservation
        throw new ForbiddenError("Cette réservation ne vous appartient pas")
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
        throw new BadRequestError("Annulation impossible ")
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
}

// Update a reservation (admin only)
export const updateReservation = async (req: Request, res: Response, next: NextFunction) => {
    // Get the id from the URL parameters and convert it to a number
    const reservationParam = parseInt(req.params.id as string);

    // Check if the id is not a valid number
    if (isNaN(reservationParam)) {
        // Return a 400 Bad Request error if the id is invalid
        throw new BadRequestError("Réservation non trouvée")
    };

    // Check if the user is authenticated
    if (!req.user) {
        // Return a 401 Unauthorized error if no user is found
        throw new UnauthorizedError("L'utilisateur n'existe pas")
    }

    // Search the database for the reservation with this id
    const findReservation = await prisma.reservation.findUnique({
        where: {
            id_RESERVATION: reservationParam
        }
    })

    // Check if the reservation was not found in the database
    if (findReservation === null) {
        // Return a 404 Not Found error
        throw new NotFoundError("La réservation n'existe pas")
    }


    // Update the reservation in the database with validated fields
    const newReservation = await prisma.reservation.update({
        // Target the reservation by its id from the URL
        where: { id_RESERVATION: reservationParam },
        // Update only the fields provided in the request body
        data: {
            nb_tickets: req.body.nb_tickets,
            date: req.body.date,
            id_TICKET: req.body.id_TICKET,
            status: req.body.status
        }
    })

    // Return the updated reservation with a 200 status
    return res.status(200).json(newReservation)
}