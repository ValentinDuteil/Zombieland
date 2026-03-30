// Business logic for attractions : handles requests and responses
// import { PrismaClient } from "@prisma/client"
import { prisma } from '../lib/prisma.js'
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/AppError.js";
import * as argon2 from 'argon2'
import { attractionSchema } from '../schemas/attraction.schema.js';
import { ZodError } from 'zod';

// const prisma = new PrismaClient()
export const getAttractions = async (req: Request, res: Response, next: NextFunction) => {
    // Extract the "category" query parameter from the request
    const categoryParam = req.query.category
    // Ensure the category is a string (req.query can return string | string[] | undefined)
    // If it's not a string, we ignore it and treat it as undefined
    const category =
        typeof categoryParam === "string" ? categoryParam : undefined
    // Fetch attractions from the database
    // If a category is provided, we filter by it
    // If not, Prisma receives "undefined" and returns all attractions
    const attractions = await prisma.attraction.findMany({
        where: category
            ? { categories: { some: { category: { name: { equals: category } } } } }
            : undefined,
        include: {
            categories: { include: { category: true } }
        }
    })
    // Send the result back to the client as JSON
    res.json(attractions)
}

// Find a single attraction by its ID
export const getAttractionById = async (req: Request, res: Response, next: NextFunction) => {
    // Get the id from the URL parameters and convert it to a number
    const attractionParam = parseInt(req.params.id as string);

    // Check if the id is not a valid number
    if (isNaN(attractionParam)) {
        // Return a 400 Bad Request error if the id is invalid
        throw new BadRequestError("Attraction non trouvée")
    };

    // Search the database for the attraction with this id
    const findAttraction = await prisma.attraction.findUnique({
        where: {
            id_ATTRACTION: attractionParam,
        },
        include: {
            categories: {
                include: { category: true }
            }
        }
    })

    // Check if the attraction was not found in the database
    if (findAttraction === null) {
        // Return a 404 Not Found error
        throw new NotFoundError("L'attraction n'existe pas")
    }

    // Return the attraction data as JSON
    return res.json(findAttraction)
}

export const createAttraction = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, min_height, duration, capacity, intensity, password } = req.body

    const user = await prisma.user.findUnique({ where: { id_USER: req.user!.id } })
    if (!user) throw new NotFoundError("Utilisateur introuvable")

    const rightPassword = await argon2.verify(user.password, password)
    if (!rightPassword) throw new UnauthorizedError("Mot de passe incorrect")

    const attraction = await prisma.attraction.create({
        data: { name, description, min_height: min_height ?? 0, duration: duration ?? 0, capacity: capacity ?? 0, intensity }
    })
    return res.status(201).json(attraction)
}

// delete an attraction by admin only, requires password confirmation
export const deleteAttraction = async (req: Request, res: Response, next: NextFunction) => {
    const attractionParam = parseInt(req.params.id as string)

    if (isNaN(attractionParam)) {
        throw new BadRequestError("ID invalide")
    }

    const findAttraction = await prisma.attraction.findUnique({
        where: { id_ATTRACTION: attractionParam }
    })

    if (findAttraction === null) {
        throw new NotFoundError("L'attraction n'existe pas")
    }

    // Check password before deleting
    const { password } = req.body ?? {}

    // Fetch the admin user from the DB to compare the password
    const user = await prisma.user.findUnique({
        where: { id_USER: req.user!.id }
    })

    if (!user) {
        throw new NotFoundError("Utilisateur introuvable")
    }

    const rightPassword = await argon2.verify(user.password, password)
    if (!rightPassword) {
        throw new UnauthorizedError("Mot de passe incorrect")
    }

    await prisma.attraction.delete({
        where: { id_ATTRACTION: attractionParam }
    })

    return res.status(204).send()
}

// update an attraction by admin only, requires password confirmation
export const updateAttraction = async (req: Request, res: Response, next: NextFunction) => {
    const attractionParam = parseInt(req.params.id as string)

    if (isNaN(attractionParam)) {
        throw new BadRequestError("ID invalide")
    }

    const findAttraction = await prisma.attraction.findUnique({
        where: { id_ATTRACTION: attractionParam }
    })

    if (findAttraction === null) {
        throw new NotFoundError("L'attraction n'existe pas")
    }

    // Check password before updating
    const { name, description, min_height, duration, capacity, intensity, password } = req.body

    // Fetch the admin user from the DB to compare the password
    const user = await prisma.user.findUnique({
        where: { id_USER: req.user!.id }
    })

    if (!user) {
        throw new NotFoundError("Utilisateur introuvable")
    }

    const rightPassword = await argon2.verify(user.password, password)
    if (!rightPassword) {
        throw new UnauthorizedError("Mot de passe incorrect")
    }

    const updatedAttraction = await prisma.attraction.update({
        where: { id_ATTRACTION: attractionParam },
        data: {
            // If the field is provided in the body, use it, otherwise keep the existing value
            name: name ?? findAttraction.name,
            description: description ?? findAttraction.description,
            min_height: min_height ?? findAttraction.min_height,
            duration: duration ?? findAttraction.duration,
            capacity: capacity ?? findAttraction.capacity,
            intensity: intensity ?? findAttraction.intensity,
        }
    })

    return res.json(updatedAttraction)
}

// Update the image of an attraction by ID, admin only
export const updateAttractionImage = async (req: Request, res: Response, next: NextFunction) => {
    const attractionParam = parseInt(req.params.id as string)

    if (isNaN(attractionParam)) {
        throw new BadRequestError("ID invalide")
    }

    const findAttraction = await prisma.attraction.findUnique({
        where: { id_ATTRACTION: attractionParam }
    })

    if (findAttraction === null) {
        throw new NotFoundError("L'attraction n'existe pas")
    }

    // Get the uploaded file path from multer
    if (!req.file) {
        throw new BadRequestError("Aucun fichier fourni")
    }

    const imagePath = `/uploads/${req.file.filename}`

    const updatedAttraction = await prisma.attraction.update({
        where: { id_ATTRACTION: attractionParam },
        data: { image: imagePath }
    })

    return res.json(updatedAttraction)
}