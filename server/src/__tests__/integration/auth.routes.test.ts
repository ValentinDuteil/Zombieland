// Testing auth routes (integration tests)

// ============================================================
// 🧪 COURS : TESTS D'INTÉGRATION
// ============================================================

// --- DIFFÉRENCE AVEC LES TESTS UNITAIRES ---
// Un test UNITAIRE teste UNE fonction isolée avec des mocks.
// Un test D'INTÉGRATION teste une ROUTE HTTP complète :
//   requête → middleware → controller → réponse
// On utilise Supertest pour simuler de vraies requêtes HTTP
// sans lancer le serveur.

// --- SUPERTEST ---
// import supertest from 'supertest'
// import app from '../../app.js'
//
// const response = await supertest(app).post('/api/auth/login').send({ email, password })
// response.status → le code HTTP retourné (200, 401, etc.)
// response.body   → le JSON retourné par le controller

// --- VI.HOISTED() : mock avant les imports ---
// Pourquoi vi.hoisted() au lieu de vi.mock('../../lib/prisma.js')comme dans les tests unitaires ?
// Les deux approches fonctionnent, mais dans les tests d'intégration on mocke @prisma/client directement 
// au lieu de ../../lib/prisma.js. Pourquoi ? Parce que app.ts importe les routes, 
// qui importent les controllers, 
// qui importent prisma.ts, 
// qui crée un new PrismaClient(). 
// En mockant @prisma/client à la racine on intercepte la création du client partout dans l'app 
// — c'est plus fiable.

// En ESM (import/export JS par modules), les imports sont exécutés avant le reste du fichier.
// vi.hoisted() permet de créer un mock AVANT les imports,
// ce qui est nécessaire pour mocker les middlewares et Prisma.
//
// const mockPrisma = vi.hoisted(() => ({
//     user: { findUnique: vi.fn(), create: vi.fn() }
// }))
//
// vi.mock('@prisma/client', () => ({
//     PrismaClient: class { constructor() { Object.assign(this, mockPrisma) } }
// }))

// --- MOCKER CHECKTOKEN ---
// checkToken est un middleware qui vérifie le JWT dans le cookie.
// Dans les tests, on le remplace par une fonction qui :
//   - par défaut : simule un user connecté (req.user = { id: 1, role: 'MEMBER' })
//   - ponctuellement : simule un user non connecté avec mockImplementationOnce()
//
// const mockCheckToken = vi.hoisted(() => vi.fn())
//
// vi.mock('../../middlewares/auth.middleware.js', () => ({
//     checkToken: mockCheckToken
// }))
//
// Dans beforeEach :
// mockCheckToken.mockImplementation((req, res, next) => {
//     req.user = { id: 1, role: 'MEMBER' }
//     next()
// })
//
// Dans un test spécifique (non connecté) :
// mockCheckToken.mockImplementationOnce((req, res, next) => {
//     next(new UnauthorizedError('Token manquant'))
// })

// --- MOCKIMPLEMENTATION vs MOCKIMPLEMENTATIONONCE ---
// mockImplementation()     → comportement par défaut pour TOUS les tests
// mockImplementationOnce() → comportement pour LE PROCHAIN appel seulement
//                            revient au comportement par défaut ensuite

// --- STRUCTURE D'UN TEST D'INTÉGRATION ---
// test('should return 401 when not authenticated', async () => {
// ARRANGE — override le middleware pour simuler non connecté
//     mockCheckToken.mockImplementationOnce((req, res, next) => {
//         next(new UnauthorizedError('Token manquant'))
//     })
// ACT — envoyer la vraie requête HTTP
//     const response = await supertest(app).get('/api/auth/me')
// ASSERT — vérifier le code HTTP et le body
//     expect(response.status).toEqual(401)
//     expect(response.body).toHaveProperty('message')
// })

// Testing auth routes — integration tests

// SETUP : replacing external dependencies with mocks
// ==================================================

// vi.hoisted() creates variables BEFORE imports (needed in ESM)
const mockPrisma = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn()
  }
}))
// Mock CSRF middleware to bypass CSRF protection during tests
vi.mock('../../middlewares/csrf.middleware.js', () => ({
    checkCsrf: (_req: any, _res: any, next: any) => next(),
    setCsrfToken: (_req: any, res: any) => res.json({ csrfToken: 'fake-token' })
}))

const mockCheckToken = vi.hoisted(() => vi.fn())

// Mock Prisma adapter and client
vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class { } }))
vi.mock('@prisma/client', () => ({
  PrismaClient: class { constructor() { Object.assign(this, mockPrisma) } }
}))

// Mock auth middleware
vi.mock('../../middlewares/auth.middleware.js', () => ({
  checkToken: mockCheckToken
}))

// Mock rate limiter — disabled in tests to avoid blocking requests
vi.mock('../../middlewares/rateLimit.middleware.js', () => ({
  authLimiter: (_req: any, _res: any, next: any) => next()
}))

// Mock argon2
vi.mock('argon2', () => ({
  verify: vi.fn(),
  hash: vi.fn().mockResolvedValue('hashedPassword')
}))

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn().mockReturnValue('fake-token') }
}))

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import supertest from 'supertest'
import app from '../../app.js'
import { UnauthorizedError } from '../../utils/AppError.js'
import * as argon2 from 'argon2'
import type { User } from '@prisma/client'

const fakeUser = {
  id_USER: 1,
  email: 'john.doe@example.com',
  password: 'hashedPassword',
  firstname: 'John',
  lastname: 'Doe',
  role: 'MEMBER',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null
} satisfies User

beforeEach(() => {
  vi.clearAllMocks()
  // Default: user is authenticated
  mockCheckToken.mockImplementation((
    req: Request & { user?: { id: number; role: string } },
    res: Response, next: NextFunction) => {
    req.user = { id: 1, role: 'MEMBER' }
    next()
  })
})

// TESTS
// =====

//AUTHENTIFICATION ROUTES
//=====

describe('GET  /api/auth/me', () => {
  test('devrait retourner 401 quand lutilisateur n est pas authentifié', async () => {
    // ARRANGE — override checkToken to simulate unauthenticated access
    mockCheckToken.mockImplementationOnce((req: any, res: any, next: any) => {
      next(new UnauthorizedError('Token manquant'))
    })

    // ACT
    const response = await supertest(app).get('/api/auth/me')

    // ASSERT
    expect(response.status).toEqual(401)
  })

  test('devrait retourner 200 quand lutilisateur est authentifié', async () => {
    // ARRANGE — mock DB returns the user
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser)

    // ACT
    const response = await supertest(app).get('/api/auth/me')

    // ASSERT
    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('email')
  })
})

describe('POST /api/auth/register', () => {
  test('devrait retoruner 409 quand l\'email est déjà utilisé', async () => {
    // ARRANGE
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser)

    // ACT
    const response = await supertest(app).post('/api/auth/register').send({
        email: 'john.doe@example.com',
        password: 'Password1!',
        firstname: 'John',
        lastname: 'Doe'
    })

    // ASSERT
    expect(response.status).toEqual(409)
  })

  test('devrait retoruner 400 quand le body est invalide', async () => {
    // ARRANGE
    // No need to mock DB because validation fails before

    // ACT
    const response = await supertest(app).post('/api/auth/register').send({
        email: 'john.doe@example.com',
        password: '', // invalid password (empty)
        firstname: 'John',
        lastname: 'Doe'
    })

    // ASSERT
    expect(response.status).toEqual(400)
  })

  test('devrait retoruner 201 quand la création est réussie', async () => {
    // ARRANGE
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.create.mockResolvedValue(fakeUser)
    // ACT
      const response = await supertest(app).post('/api/auth/register').send({
          email: 'john.doe@example.com',
          password: 'Password1!',
          firstname: 'John',
          lastname: 'Doe'
      })

    // ASSERT
    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty('email')
  })
})

describe('POST /api/auth/login', () => {
  test('devrait retourner 401 si l\'email est inexistant', async () => {
    // ARRANGE
    mockPrisma.user.findUnique.mockResolvedValue(null)    
    
    // ACT
    const response = await supertest(app).post('/api/auth/login').send({
        email: 'john.doe@example.com',
        password: 'Password1!',
    })

    // ASSERT
    expect(response.status).toEqual(401)
  })

  test('devrait retourner 401 si le mot de passe est incorrect', async () => {
    // ARRANGE
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser)
    vi.mocked(argon2.verify).mockResolvedValue(false)

    // ACT
    const response = await supertest(app).post('/api/auth/login').send({
        email: 'john.doe@example.com',
        password: 'WrongPassword1!'
    })

    // ASSERT
    expect(response.status).toEqual(401)
  })

  test('devrait retoruner 400 quand le body est invalide', async () => {
    // ARRANGE
    // No need to mock DB because validation fails before

    // ACT
    const response = await supertest(app).post('/api/auth/login').send({
        email: 'john.doe@example.com',
        password: '' // invalid password (empty)
    })

    // ASSERT
    expect(response.status).toEqual(400)
  })

  test('devrait retoruner 200 quand la connexion est réussie', async () => {
    // ARRANGE
    mockPrisma.user.findUnique.mockResolvedValue(fakeUser)
    vi.mocked(argon2.verify).mockResolvedValue(true)

    // ACT
    const response = await supertest(app).post('/api/auth/login').send({
        email: 'john.doe@example.com',
        password: 'Password1!'
    })

    // ASSERT
    expect(response.status).toEqual(200)

  })
})

describe('POST /api/auth/logout', () => {
  test('devrait retoruner 200 quand la déconnexion est réussie', async () => {
    // ARRANGE
    // No need to mock DB or middleware because logout just clears the cookie

    // ACT
    const response = await supertest(app).post('/api/auth/logout')

    // ASSERT
    expect(response.status).toEqual(200)
  })
})