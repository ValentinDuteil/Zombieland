// Testing auth controller

// ============================================================
// 🧪 COURS : MOCKS ET SPIES EN TESTS UNITAIRES
// ============================================================

// --- POURQUOI MOCKER ? ---
// Un test UNITAIRE teste UNE seule chose en isolation.
// Si notre controller appelle Prisma → la BDD → le réseau...
// Ce n'est plus un test unitaire, c'est un test d'intégration.
// On "mocke" (simule) les dépendances externes pour rester isolé.

// --- VI.MOCK() : remplace un module entier par une simulation ---
//vi.mock('../lib/prisma.js', () => ({
//    prisma: {
//        user: {
// vi.fn() = une fonction "espion" qui ne fait rien par défaut
// mais qu'on peut programmer pour retourner ce qu'on veut
//            findUnique: vi.fn()
//        }
//    }
//}))

// --- VI.FN() : une fonction factice ---
// Elle ne fait rien par défaut, mais on peut lui dire quoi retourner :
//const mockFn = vi.fn()
//mockFn.mockResolvedValue({ id: 1, email: 'test@test.com' })
// → quand appelée, retourne une Promise qui résout avec cet objet

// --- MOCKRETURNVALUE vs MOCKRESOLVEDVALUE ---
// mockReturnValue()  → retourne une valeur synchrone
// mockResolvedValue() → retourne une Promise résolue (pour async/await)
// mockRejectedValue() → retourne une Promise rejetée (pour simuler une erreur)

// --- BEFOREEACH : reset avant chaque test ---
// Sans ça, les mocks gardent leur état entre les tests → bugs bizarres
//beforeEach(() => {
//    vi.clearAllMocks() // remet tous les vi.fn() à zéro
//})

// --- EXPECT : vérifier ce qui s'est passé ---
// expect(mockFn).toHaveBeenCalled()           → a été appelée ?
// expect(mockFn).toHaveBeenCalledWith({...})  → appelée avec ces args ?
// expect(mockFn).toHaveBeenCalledTimes(1)     → appelée exactement 1 fois ?
// expect(result).toBe(200)                    → égalité stricte
// expect(result).toEqual({ id: 1 })           → égalité profonde (objets)



// SETUP : replacing external dependencies with mocks
// ==================================================

// Mock Prisma : instead of hitting the real database, we simulate the user model
vi.mock('../lib/prisma.js', () => ({
    prisma: {
        user: {
            findUnique: vi.fn()
        }
    }
}))

// Mock argon2
vi.mock('argon2', () => ({
    verify: vi.fn()


}))

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
    default: { sign: vi.fn().mockReturnValue('fake-token') }
}))


// Import the mocked modules and the controller to test
//=====================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '../controllers/auth.controller.js'
import { prisma } from '../lib/prisma.js'
import * as argon2 from 'argon2'
import type { User } from '@prisma/client'

// TESTS
// =====

//LOGIN
//=====

describe('login', () => {

    beforeEach(() => {
        vi.clearAllMocks() // reset all mocks before each test to avoid interference
    })

    it('devrait retourner 401 si email inexistant', async () => {

        // ARRANGE — setting up the conditions for the test
        // "If we're looking for an unknown email, Prisma should return null"
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

        // Créating fake req, res, next objects to call the controller function
        const req = {
            body: { email: 'inconnu@test.com', password: 'monMotDePasse' }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(), // .mockReturnThis() = return res itself
            json: vi.fn()                      // to allow chaining like res.status(401).
        } as any
        const next = vi.fn() // Express next() — checking if it's called with an error

        // ACT — calling the real function we're testing
        try {
            await login(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT — checking the expected outcomes
        expect(next).toHaveBeenCalledWith( //login has to call next() with an error
            expect.objectContaining({ statusCode: 401 })
        )
    })

    it('devrait retourner 401 si mot de passe incorrect', async () => {

        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue({
            id_USER: 1,
            email: 'test@test.com',
            password: 'wrongPassword',
            firstname: 'John',
            lastname: 'Doe',
            role: 'MEMBER',
            created_at: new Date(),
            updated_at: new Date()
        } satisfies User)
        // satisfies User = TypeScript check pour s'assurer que l'objet correspond à notre modèle Prisma
        vi.mocked(argon2.verify).mockResolvedValue(false)

        const req = { body: { email: 'test@test.com', password: 'wrongPassword' } } as any
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
        const next = vi.fn()

        // ACT
        try {
            await login(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401 })
        )
    })

    it('devrait retourner 200 si connexion réussie', async () => {

        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue({
            id_USER: 1,
            email: 'test@test.com',
            password: 'correctPassword',
            firstname: 'John',
            lastname: 'Doe',
            role: 'MEMBER',
            created_at: new Date(),
            updated_at: new Date()
        } satisfies User)
        vi.mocked(argon2.verify).mockResolvedValue(true)

        const req = { body: { email: 'test@test.com', password: 'correctPassword' } } as any
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), cookie: vi.fn() } as any
        const next = vi.fn()

        // ACT
        try {
            await login(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(next).not.toHaveBeenCalled() // pas d'erreur
        expect(res.json).toHaveBeenCalledWith({ message: "Connexion réussie" })
    })
})