// Business logic for attractions : handles requests and responses
// import { PrismaClient } from "@prisma/client"
import { prisma } from '../lib/prisma.js'
// const prisma = new PrismaClient()
export const getAttraction = async (req, res) => {
    try {
        // Extract the "category" query parameter
        const categoryParam = req.query.category

        // Ensure the category is a string (req.query can return string | string[] | undefined)
        const category =
            typeof categoryParam === "string" ? categoryParam : undefined

        // Fetch attractions filtered by category (N-N relation)
        const attractions = await prisma.attraction.findMany({
            where: category
                ? {
                    // Filter attractions that have at least one matching category
                    categories: {
                        some: {
                            category: {
                                name: category
                            }
                        }
                    }
                }
                : undefined,
            include: {
                // Include related categories for frontend usage
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        })

        // Send the result back to the client
        res.json(attractions)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Erreur lors de la récupération des attractions"
        })
    }
}




