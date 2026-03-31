//logic for ticket management
import { prisma } from '../lib/prisma.js'
import { Request, Response, NextFunction } from 'express'
import { NotFoundError, UnauthorizedError } from '../utils/AppError.js'
import * as argon2 from 'argon2'

export const getAllprices = async (req: Request, res: Response, next: NextFunction) => {

        const ticket = await prisma.ticket.findUnique({
            where: { id_TICKET: 1},
        })
        if (!ticket) throw new NotFoundError("Ticket non trouvé")
            res.json({ price: ticket.amount })
        
}

export const updateTicketPrice = async (req: Request, res: Response, next: NextFunction) => {
    const { price, password } = req.body

    const admin = await prisma.user.findUnique({
        where: { id_USER: req.user!.id },
    })
    
    if (!admin) throw new NotFoundError("Admin non trouvé")

    const rightPassword = await argon2.verify(admin.password, password)
    if (!rightPassword) throw new UnauthorizedError("Mot de passe incorrect")

    await prisma.ticket.update({
        where: { id_TICKET: 1 },
        data: { amount: price },
    })
    res.json({ message: "Prix du ticket mis à jour avec succès" })
}