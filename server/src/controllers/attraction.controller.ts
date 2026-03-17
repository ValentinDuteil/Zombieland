// Business logic for attractions : handles requests and responses
// import { PrismaClient } from "@prisma/client"
import { prisma } from '../lib/prisma.js'
import { Request, Response, NextFunction } from 'express';
// const prisma = new PrismaClient()
export const getAttraction = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
        // Log the error for debugging
        console.error(error)
        // Send a generic error response to the client
        res.status(500).json({
            error: "Erreur lors de la récupération des attractions"
        })
    }
}

// Find a single attraction by its ID
export const getFindAttraction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the id from the URL parameters and convert it to a number
        const attractionParam = parseInt(req.params.id as string);

        // Check if the id is not a valid number
        if (isNaN(attractionParam)) {
            // Return a 400 Bad Request error if the id is invalid
            return res.status(400).json({
                error: "Incorrect Attraction"
            })
        };

        // Search the database for the attraction with this id
        const findAttraction = await prisma.attraction.findUnique({
            where: {
                id_ATTRACTION: attractionParam,
            },
            include: {categories: { include : {category: true}
    }}})

        // Check if the attraction was not found in the database
        if (findAttraction === null) {
            // Return a 404 Not Found error
            return res.status(404).json({
                error: "Attraction n'existe pas"
            })
        }

        // Return the attraction data as JSON
        return res.json(findAttraction)

    } catch (error) {
        // Log the error for debugging
        console.error(error)
        // Return a 500 Internal Server Error for unexpected errors
        return res.status(500).json({
            error: "Erreur lors de la récupération des attractions"
        })
    }
}



