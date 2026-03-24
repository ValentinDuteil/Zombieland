// Business logic for attractions : handles requests and responses
// import { PrismaClient } from "@prisma/client"
import { prisma } from '../lib/prisma.js'
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { notDeepEqual } from 'node:assert';
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

// create a new attraction admin only
export const createAttraction = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, min_height, duration, capacity, intensity } = req.body

    // check if all required fields are presente 
    if (!name || !description || !intensity) {
        throw new BadRequestError("Données invalides")
    }

    // create the attraction in the db
    const attraction = await prisma.attraction.create({
        data: {
            name,
            description,
            min_height: min_height || 0,
            duration: duration || 0,
            capacity: capacity || 0,
            intensity,
        }
    })
    return res.status(201).json(attraction)
}

// delete an attraction by admin only
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

    await prisma.attraction.delete({
        where: { id_ATTRACTION: attractionParam }
    })
    return res.status(204).send()
}

// update an attraction by admin only
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
    const { name, description, min_height, duration, capacity, intensity } = req.body

    const updateAttraction = await prisma.attraction.update({
        where: { id_ATTRACTION: attractionParam },
        data: {
            // "??"" if the field is provided in the body, use it, otherwise keep the existing value
            name: name ?? findAttraction.name,
            description: description ?? findAttraction.description,
            min_height: min_height ?? findAttraction.min_height,
            duration: duration ?? findAttraction.duration,
            capacity: capacity ?? findAttraction.capacity,
            intensity: intensity ?? findAttraction.intensity,
        }
    })
    return res.json(updateAttraction)
}