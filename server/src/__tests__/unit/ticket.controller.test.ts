// Testing ticket controller
// Commentaires en français pour bien visualiser ce que je fais

// simule les méthodes ticket et user de la BDD (pas de vraie connexion)
vi.mock('../../lib/prisma.js', () => ({
    prisma: {
        ticket: {
            findUnique: vi.fn(),
            update: vi.fn()
        },
        user: {
            findUnique: vi.fn()
        }
    }
}))

// remplace la vraie lib de hash par une fausse version contrôlable dans les tests
vi.mock('argon2', () => ({
    verify: vi.fn()
}))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllprices, updateTicketPrice } from '../../controllers/ticket.controller.js'
import { prisma } from '../../lib/prisma.js'
import * as argon2 from 'argon2'
import type { Ticket, User } from '@prisma/client'

// Fausses données réutilisées dans tous les tests pour éviter la duplication
const fakeTicket = {
    id_TICKET: 1,
    amount: 25,
    created_at: new Date(),
    updated_at: new Date()
} satisfies Ticket

const fakeAdmin = {
    id_USER: 1,
    firstname: 'Admin',
    lastname: 'Test',
    email: 'admin@test.com',
    password: 'hashed_password',
    role: 'ADMIN',
    created_at: new Date(),
    updated_at: new Date()
} satisfies User

// ============================================================
// getAllprices - récupération du prix du ticket
// ============================================================

describe('getAllprices', () => {

    // Réinitialise tous les mocks avant chaque test pour éviter les effets de bord
    beforeEach(() => { vi.clearAllMocks() })

    it('should return 200 with current ticket price', async () => {
        // Simule un ticket existant en BDD avec un prix de 25
        vi.mocked(prisma.ticket.findUnique).mockResolvedValue(fakeTicket)
        const req = {} as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        try { await getAllprices(req, res, next) } catch (err) { next(err) }

        // Vérifie qu'aucune erreur n'a été levée et que le prix est bien retourné
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ price: fakeTicket.amount })
    })

    it('should return 404 if ticket does not exist', async () => {
        // Simule l'absence de ticket en BDD (findUnique retourne null)
        vi.mocked(prisma.ticket.findUnique).mockResolvedValue(null)
        const req = {} as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        try { await getAllprices(req, res, next) } catch (err) { next(err) }

        // Vérifie que next a bien été appelé avec une erreur 404
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 404 })
        )
    })
})

// ============================================================
// updateTicketPrice - modification du prix du ticket
// ============================================================

describe('updateTicketPrice', () => {

    // Réinitialise tous les mocks avant chaque test pour éviter les effets de bord
    beforeEach(() => { vi.clearAllMocks() })

    it('should return 200 and update the price when password is correct', async () => {
        // Simule un admin existant en BDD, un mot de passe correct et une mise à jour réussie
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeAdmin)
        vi.mocked(argon2.verify).mockResolvedValue(true)
        vi.mocked(prisma.ticket.update).mockResolvedValue({ ...fakeTicket, amount: 30 })

        const req = {
            body: { price: 30, password: 'correct_password' },
            user: { id: 1, role: 'ADMIN' }
        } as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        try { await updateTicketPrice(req, res, next) } catch (err) { next(err) }

        // Vérifie qu'aucune erreur n'a été levée, que prisma.ticket.update a bien été appelé avec le bon prix et que le message de succès est retourné
        expect(next).not.toHaveBeenCalled()
        expect(prisma.ticket.update).toHaveBeenCalledWith({
            where: { id_TICKET: 1 },
            data: { amount: 30 }
        })
        expect(res.json).toHaveBeenCalledWith({ message: "Prix du ticket mis à jour avec succès" })
    })

    it('should return 404 if admin user does not exist', async () => {
        // Simule l'absence de l'admin en BDD (findUnique retourne null)
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

        const req = {
            body: { price: 30, password: 'any_password' },
            user: { id: 99, role: 'ADMIN' }
        } as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        try { await updateTicketPrice(req, res, next) } catch (err) { next(err) }

        // Vérifie que next a bien été appelé avec une erreur 404 et que la BDD n'a pas été modifiée
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 404 })
        )
        expect(prisma.ticket.update).not.toHaveBeenCalled()
    })

    it('should return 401 if password is incorrect', async () => {
        // Simule un admin existant en BDD mais argon2.verify retourne false (mauvais mot de passe)
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeAdmin)
        vi.mocked(argon2.verify).mockResolvedValue(false)

        const req = {
            body: { price: 30, password: 'wrong_password' },
            user: { id: 1, role: 'ADMIN' }
        } as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        try { await updateTicketPrice(req, res, next) } catch (err) { next(err) }

        // Vérifie que next a bien été appelé avec une erreur 401 et que la BDD n'a pas été modifiée
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401 })
        )
        expect(prisma.ticket.update).not.toHaveBeenCalled()
    })
})
