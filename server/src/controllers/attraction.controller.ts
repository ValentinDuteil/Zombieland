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
                ? { category: { equals: category } }
                : undefined
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




