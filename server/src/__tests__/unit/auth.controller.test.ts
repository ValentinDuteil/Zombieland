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
vi.mock('../../lib/prisma.js', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn()
        }
    }
}))

// Mock argon2
vi.mock('argon2', () => ({
    verify: vi.fn(),
    hash: vi.fn()


}))

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
    default: { sign: vi.fn().mockReturnValue('fake-token') }
}))


// Import the mocked modules and the controller to test
//=====================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { login, register, logout, me } from '../../controllers/auth.controller.js'
import { prisma } from '../../lib/prisma.js'
import * as argon2 from 'argon2'
import type { User } from '@prisma/client'

// Create fake User object to reuse in tests
//==========================================

const fakeUser = {
    id_USER: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    firstname: 'John',
    lastname: 'Doe',
    role: 'MEMBER',
    created_at: new Date(),
    updated_at: new Date()
} satisfies User

// reset all mocks before each test to avoid interference
//=======================================================

beforeEach(() => {
        vi.clearAllMocks() 
    })

// TESTS
// =====

//LOGIN
//=====

describe('login', () => {

    it('devrait retourner 401 si email inexistant', async () => {

        // ARRANGE — setting up the conditions for the test
        // "If we're looking for an unknown email, Prisma should return null"
        // Database is fake, we control what it returns
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

        // Créating fake req, res, next objects to call the controller function
        // req fakes what the user would send in the body of the request
        const req = {
            body: { email: 'inconnu@test.com', password: 'monMotDePasse' }
        } as any
        // res fakes the Express response object, with spy functions for status() and json()
        // .mockReturnThis() = return res itself to allow chaining like res.status(401).json(...)
        // if necesseray, json: vifn() or  cookies: vifn() are spying that we call json or cookies, 
        // but they don't do anything by default      
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any
        // next is a spy function to check if we call it with an error
        const next = vi.fn()

        // ACT — calling the real function we're testing
        // if it throws, we catch the error and pass it to next() to check it in ASSERT
        try {
            await login(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT — checking the expected outcomes
        // expect(next) means "I want to verify what happened with the next() function"
        // .toHaveBeenCalledWith(...) means "Was called with this argument"
        //expect.objectContaining({ statusCode: 401 }) means "an object that has AT LEAST "statusCode: 401""
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401 })
        )
    })

    it('devrait retourner 401 si mot de passe incorrect', async () => {

        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeUser)
        // satisfies User = TypeScript check to be sur of the shape as Prisma's one
        vi.mocked(argon2.verify).mockResolvedValue(false)

        const req = {
            body: {
                email: 'test@test.com', password: 'wrongPassword'
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any
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
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeUser)
        vi.mocked(argon2.verify).mockResolvedValue(true)

        const req = {
            body: {
                email: 'test@test.com',
                password: 'correctPassword'
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await login(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        // no error should be passed to next()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ message: "Connexion réussie" })
    })

    it('devrait retourner 400 si body invalide', async () => {
        // ARRANGE
        const req = {
            body: {
                email: 'pas-un-email', // email invalide
                password: ''
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await login(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400 })
        )
    })
})

//REGISTER
//========

describe('register', () => {

    it('devrait retourner 409 si l\'email est déjà utilisé', async () => {

        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeUser)
        const req = {
            body: {
                email: 'john.doe@example.com',
                password: 'Password1!',
                firstname: 'John',
                lastname: 'Doe'
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await register(req, res, next)
        } catch (err) {
            next(err)
        }


        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 409 })
        )
    })

    it('devrait retourner 201 si l\'inscription est réussie', async () => {

        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
        vi.mocked(prisma.user.create).mockResolvedValue(fakeUser)
        const req = {
            body: {
                email: 'john.doe@example.com',
                password: 'Password1!',
                firstname: 'John',
                lastname: 'Doe'
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await register(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        // no error
        // response ok
        // json return user without password
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalled()
    })

    it('devrait retourner 400 si body invalide', async () => {
        // ARRANGE
        const req = {
            body: {
                email: 'pas-un-email',
                password: ''
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await register(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400 })
        )
    })
})

//LOGOUT
//======

describe('logout', () => {

    it('devrait retourner 200 lors de la déconnexion', async () => {

        // ARRANGE
        const req = { body: {} } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            clearCookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await logout(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object))
        expect(res.json).toHaveBeenCalledWith('Déconnexion')
    })
})

//ME
//==

describe('me', () => {

    it('devrait retourner 401 si l\'utilisateur n\'est pas connecté', async () => {

        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeUser)
        // req.user is defined by the auth middleware
        // so we have to fake it here to test the "me" controller function
        const req = {
            user: undefined
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as any
        const next = vi.fn()

        // ACT
        try {
            await me(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401 })
        )
    })

    it('devrait retourner 200 et les informations de l\'utilisateur si celui-ci est connecté', async () => {
        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeUser)
        // req.user is defined by the auth middleware
        // so we have to fake it here to test the "me" controller function
        const req = {
            user: {
                id: 1,
                role: 'MEMBER'
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await me(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                id_USER: 1,
                email: 'test@test.com',
                firstname: 'John',
                lastname: 'Doe',
                role: 'MEMBER'
            })
        )
    })

    it('devrait retourner 404 si l\'utilisateur connecté n\'existe pas en base', async () => {

        // ARRANGE
        // with fake ID that doesn't exist in database, Prisma should return null
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
        const req = {
            user: {
                id: 999,
                role: 'MEMBER'
            }
        } as any
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        } as any
        const next = vi.fn()

        // ACT
        try {
            await me(req, res, next)
        } catch (err) {
            next(err)
        }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 404 })
        )
    })
})