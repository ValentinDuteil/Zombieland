// Business logic for reservations : handles requests and responses

import type { Request, Response, NextFunction } from "express";
// Talk to the db
import { prisma } from '../lib/prisma.js'
// Import the validation schema
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from "../utils/AppError.js";
import * as argon2 from 'argon2'


// Retrieves all reservations for admin
export const getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
    // Query the db to retrieve all reservations
    const reservations = await prisma.reservation.findMany({
        include: {
            user: {
                select: { email: true, firstname: true, lastname: true }
            }
        }
    })

    // Return reservations with a 200 status (success)
    res.status(200).json(reservations)
}

// Retrieves all reservations for admin
export const getUserReservations = async (req: Request, res: Response, next: NextFunction) => {
    // Query params to get User ID
    if (!req.user) {
        throw new UnauthorizedError("L'utilisateur n'existe pas")
    }

    const userId = parseInt(req.params.userId as string)
    if (isNaN(userId)) {
        throw new BadRequestError("ID invalide")
    }

    const reservations = await prisma.reservation.findMany({
        where: { id_USER: userId }
    })

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

    // Validate date format
    if (!date || isNaN(new Date(date).getTime())) {
        throw new BadRequestError("Date invalide")
    }

    // Reading the maximum ticket capacity from the settings table
    const maxSetting = await prisma.setting.findUnique({
        where: { key: 'max_tickets_per_day' }
    })
    const maxTickets = parseInt(maxSetting?.value ?? '9999')

    // Adding a maximum of tickets per day
    const reservationsByDay = await prisma.reservation.groupBy({
        by: ['date'],
        where: {
            date: new Date(date),
            status: 'CONFIRMED'
        },
        _sum: { nb_tickets: true }
    })

    const totalTickets = reservationsByDay[0]?._sum.nb_tickets ?? 0
    const availableSpots = maxTickets - totalTickets

    // If the park is full
    if (availableSpots <= 0) {
        throw new BadRequestError("Capacité maximale atteinte pour cette date")
    }

    // If not enough spots for the requested tickets
    if (totalTickets + nb_tickets > maxTickets) {
        throw new BadRequestError(`Vous ne pouvez pas réserver autant de billets. Il reste seulement ${availableSpots} place(s) disponible(s) pour cette date.`)
    }

    // If id_USER is provided, it means an admin is creating a reservation for a member
    // We need to verify that this member actually exists in the database
    if (id_USER) {
        // Search for the member in the database
        const findUser = await prisma.user.findUnique({ where: { id_USER } });
        // If the member doesn't exist, return a 404 error
        if (findUser === null) {
            // Return a 404 Not Found error
            throw new NotFoundError('Utilisateur non trouvé')
        }
    };
    // Check if the ticket exists in the database (for both admin and member)
    const ticket = await prisma.ticket.findUnique({ where: { id_TICKET } });
    // If the ticket doesn't exist, return a 404 error
    if (ticket === null) {
        // Return a 404 Not Found error
        throw new NotFoundError('Ticket non trouvé')
    };

    // Create the reservation in the database
    const reservation = await prisma.reservation.create({
        data: {
            nb_tickets,
            date: new Date(date),
            id_TICKET,
            id_USER: id_USER || req.user.id, // ← ici

            total_amount: nb_tickets * Number(ticket.amount),
            status: 'CONFIRMED'
        }
    });

    // Fetch reservation WITH user relation
    const reservationWithUser = await prisma.reservation.findUnique({
        where: { id_RESERVATION: reservation.id_RESERVATION },
        include: {
            user: {
                select: { firstname: true, lastname: true, email: true }
            }
        }
    });

    // Return the created reservation with a 201 status with relation to user if it exists
    res.status(201).json(reservationWithUser);
};

export const getAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
    // Read the daily ticket cap from the settings table
    const maxSetting = await prisma.setting.findUnique({
        where: { key: 'max_tickets_per_day' }
    })
    const maxTickets = parseInt(maxSetting?.value ?? '9999')

    // getAllDates to check their availability
    const allDates = await prisma.reservation.groupBy({
        by: ['date'],
        where: {
            status: 'CONFIRMED'
        },
        _sum: { nb_tickets: true }
    })

    // Map the results to return the date and the number of available tickets (10,000 - reserved)
    const availabilities = allDates.map(date => ({
        date: date.date,
        available: (date._sum.nb_tickets ?? 0) < maxTickets
    }))

    // Return the availabilities with a 200 status
    res.status(200).json(availabilities)
}

// Cancel a reservation with J-10 rule
export const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    const reservationParam = parseInt(req.params.id as string)
    if (isNaN(reservationParam)) {
        throw new BadRequestError("Réservation non trouvée")
    }

    if (!req.user) {
        throw new UnauthorizedError("L'utilisateur n'existe pas")
    }

    const { password } = req.body
    if (!password) {
        throw new BadRequestError("Mot de passe requis")
    }

    const findReservation = await prisma.reservation.findUnique({
        where: { id_RESERVATION: reservationParam }
    })
    if (!findReservation) {
        throw new NotFoundError("La réservation n'existe pas")
    }

    // --- SECURITY ---
    const isAdmin = req.user.role === 'ADMIN'

    // if the user is not an admin, he can only cancel his own reservations
    if (!isAdmin && findReservation.id_USER !== req.user.id) {
        throw new ForbiddenError("Cette réservation ne vous appartient pas")
    }

    // check if the password is correct (for both admin and member, 
    // because even an admin must provide his password to cancel)
    const user = await prisma.user.findUnique({ where: { id_USER: req.user.id } })
    if (!user) throw new NotFoundError("Utilisateur introuvable")

    const rightPassword = await argon2.verify(user.password, password)
    if (!rightPassword) throw new UnauthorizedError("Mot de passe incorrect")

    // --- D-10 Rule ---
    if (!isAdmin) {
        const dateNow = new Date();
        const dateReservation = new Date(findReservation.date);
        const calculDate = dateReservation.getTime() - dateNow.getTime();
        const resultDate = Math.round(calculDate / (1000 * 60 * 60 * 24))

        if (resultDate < 10) {
            throw new BadRequestError("Annulation impossible moins de 10 jours avant")
        }
    }

    await prisma.reservation.update({
        where: { id_RESERVATION: reservationParam },
        data: { status: "CANCELLED" }
    })

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