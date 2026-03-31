import { prisma } from '../lib/prisma.js'
import { Request, Response, NextFunction } from 'express'
import { NotFoundError, UnauthorizedError } from '../utils/AppError.js'
import * as argon2 from 'argon2'

// Returns the current daily ticket cap from the settings table
export const getMaxTickets = async (req: Request, res: Response, next: NextFunction) => {
    const setting = await prisma.setting.findUnique({
        where: { key: 'max_tickets_per_day' }
    })
    if (!setting) throw new NotFoundError("Paramètre introuvable")
    res.json({ value: parseInt(setting.value) })
}

// Updates the daily ticket cap — requires admin password confirmation
export const updateMaxTickets = async (req: Request, res: Response, next: NextFunction) => {
    const { value, password } = req.body

    const admin = await prisma.user.findUnique({
        where: { id_USER: req.user!.id }
    })
    if (!admin) throw new NotFoundError("Administrateur introuvable")

    const rightPassword = await argon2.verify(admin.password, password)
    if (!rightPassword) throw new UnauthorizedError("Mot de passe incorrect")

    await prisma.setting.update({
        where: { key: 'max_tickets_per_day' },
        data: { value: String(value) }
    })
    res.json({ message: 'Plafond mis à jour avec succès' })
}