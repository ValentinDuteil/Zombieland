// Testing tickets controller
// Commentaire ajouté en français pour bien visualiser ce que je fais

// Create a mock Prisma client hoisted to the top of the file
// Crée un faux client prisma hissé en haut du fichier (avant les imports)
const mockPrisma = vi.hoisted(() => ({
    ticket: { findUnique: vi.fn(), update: vi.fn() }, // Simule les méthodes ticket de la BDD
    user: { findUnique: vi.fn() }, // Simule les méthodes user de la BDD
}))

// Create a mock function for the token authentication middleware
// Créer une fausse fonction pour le middleware d'authentification
const mockCheckToken = vi.hoisted(() => vi.fn())

// Mock the Prisma PostgreSQL adapter
// Remplace l'adaptateur prisma/postgresql par une classe vide (pas besoin de vraie bdd)
vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class { } }))
// Mock the Prisma client to use our mockPrisma object
// remplace le vrai client prisma par notre faux client mockPrisma (qui a des méthodes simulées pour les tests)
vi.mock('@prisma/client', () => ({
    PrismaClient: class { constructor() { Object.assign(this, mockPrisma) } }
}))

// Mock the authentication middleware
// remplace le vrai middleware d'authentification par notre fausse fonction
vi.mock('../../middlewares/auth.middleware.js', () => ({
    checkToken: mockCheckToken
}))

// Mock the argon2 password hashing library
// remplace argon2 par une fausse version qui retourne toujours "mot de passe correct"
vi.mock('argon2', () => ({
    verify: vi.fn().mockResolvedValue(true)
}))

import { vi, test, describe, expect, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import supertest from 'supertest'
import app from '../../app.js'
import { UnauthorizedError } from '../../utils/AppError.js'
import * as argon2 from 'argon2'

// Run before each test to reset mocks and set default behavior
// Exécuté avant chaque test : réinitialise les mocks et définit le comportement par défaut (authentifié en tant qu'ADMIN, car la plupart des routes nécessitent un ADMIN)
beforeEach(() => {
    vi.clearAllMocks()
    // Default: authenticated as ADMIN (most routes require ADMIN)
    // Par défaut : authentifié en tant qu'ADMIN (la plupart des routes nécessitent un ADMIN)
    mockCheckToken.mockImplementation((req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
        req.user = { id: 1, role: 'ADMIN' }
        next()
    })
})

// ============================================================
// GET /api/tickets - récupération du prix du ticket
// ============================================================

describe('GET /api/tickets', () => {

    test('should return 200 with the ticket price', async () => {

        // Simule un ticket existant en BDD avec un prix de 25

        mockPrisma.ticket.findUnique.mockResolvedValue({ id_TICKET: 1, amount: 25 })

        // Envoi une requête GET à l'endpoint /api/tickets

        const response = await supertest(app).get('/api/tickets')

        // Vérifie que la réponse a un statut 200 et que le corps de la réponse contient la propriété "price" avec la valeur 25
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)

        expect(response.status).toEqual(200)

        expect(response.body).toHaveProperty('price', 25)

    })

    test('should return 404 when ticket does not exist', async () => {

        // Simule l'absence de ticket en BDD

        mockPrisma.ticket.findUnique.mockResolvedValue(null)

        // Envoi une requête GET à l'endpoint /api/tickets

        const response = await supertest(app).get('/api/tickets')

        // Vérifie que la réponse a un statut 404 (ticket non trouvé)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)

        expect(response.status).toEqual(404)

    })

})

// ============================================================
// PATCH /api/tickets/price - modification du prix du ticket 
// ============================================================

describe('PATCH /api/tickets/price', () => {
    test('should return 200 when price is updated successfully', async () => {
        // // simule un admin authentifié en bdd mot de passe correct et mise à jour du prix du ticket réussie
        mockPrisma.user.findUnique.mockResolvedValue({ id_USER: 1, password: 'hashed' })
        vi.mocked(argon2.verify).mockResolvedValue(true)
        mockPrisma.ticket.update.mockResolvedValue({ id_TICKET: 1, amount: 30 })
        // envoi une requête PATCH à l'endpoint /api/tickets/price avec un nouveau prix et un mot de passe correct
        const response = await supertest(app).patch('/api/tickets/price').send({ price: 30, password: 'correctPassword' })
        // verifie que la réponse a un statut 200 et que le corps de la réponse contient une propriété "message" (indiquant que le prix a été mis à jour avec succès)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('message')
    })
    test('should return 401 when user is not authenticated', async () => {
        // simule un middleware d'authentification qui ne trouve pas de token dans la requête et renvoie une erreur UnauthorizedError
        mockCheckToken.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            next(new UnauthorizedError('Token manquant'))
        })
        // envoi une requete patch sans etre authentifié (pas de token) à l'endpoint /api/tickets/price
        const response = await supertest(app).patch('/api/tickets/price').send({ price: 30, password: 'somePassword' })
        // verifie que la réponse a un statut 401 (non autorisé)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(401)
    })
    test('should return 403 when user is not an admin', async () => {
        // simiule un utilisateur connecté mais avec le role member (pas admin)
        mockCheckToken.mockImplementationOnce((req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
            req.user = { id: 1, role: 'MEMBER' }
            next()
        })
        // envoie une requete patch avec un utilisateur non admin à l'endpoint /api/tickets/price
        const response = await supertest(app).patch('/api/tickets/price').send({ price: 30, password: 'somePassword' })
        // verifie que la réponse a un statut 403 (interdit)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(403)
    })
    test('should return 404 when admin user does not exist', async () => {
        // simule l'absence de l'utilisateur admin en bdd
        mockPrisma.user.findUnique.mockResolvedValue(null)
        // envoie une requete patch avec un utilisateur admin qui n'existe pas en bdd à l'endpoint /api/tickets/price
        const response = await supertest(app).patch('/api/tickets/price').send({ price: 30, password: 'correctPassword' })
        // verifie que l'api retourne bien une erreur 404 (utilisateur admin non trouvé)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(404)
    })
    test('should return 401 when password is incorrect', async () => {
        // simule un admin authentifié en bdd avec un mot de passe incorrect
        mockPrisma.user.findUnique.mockResolvedValue({ id_USER: 1, password: 'hashed' })
        vi.mocked(argon2.verify).mockResolvedValue(false)
        // envoie une requete patch avec un mot de passe incorrect à l'endpoint /api/tickets/price
        const response = await supertest(app).patch('/api/tickets/price').send({ price: 30, password: 'wrongPassword' })
        // verifie que la réponse a un statut 401 (mot de passe incorrect)
        console.log('STATUS:', response.status)
        console.log('BODY:', response.body)
        expect(response.status).toEqual(401)
    })
})

