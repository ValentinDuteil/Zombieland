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

// Import the mocked modules and the controller to test
//=====================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '../controllers/auth.controller.js'

// TESTS
// =====

