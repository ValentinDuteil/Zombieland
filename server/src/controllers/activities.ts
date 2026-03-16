// Business logic for attractions : handles requests and responses
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getActivities = async (req, res) => {
    try {
        const activities = await prisma.attraction.findMany()
        res.json(activities)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération des activités" })
    }
}