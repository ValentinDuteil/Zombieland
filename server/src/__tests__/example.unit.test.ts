// ============================================
// EXEMPLE DE TEST UNITAIRE CORRECT
// ============================================
// Ce fichier montre un example simple pour que tu comprennes le pattern
// À adapter à ton cas reservations.controllers.test.ts

import { vi, test, expect, beforeEach, describe } from 'vitest'
import { Request, Response, NextFunction } from 'express'

// ============ SETUP DES MOCKS ============

// Mock Prisma
const mockPrisma = vi.hoisted(() => ({
  user: { 
    findUnique: vi.fn(),   // On mock juste ce qu'on va tester
    create: vi.fn()
  }
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: class { constructor() { Object.assign(this, mockPrisma) } }
}))

// Import d'une fonction SIMPLE à tester
// (Imagine une fonction getUserById qui cherche un user)
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id
  if (!userId) {
    throw new Error('ID manquant')
  }
  
  // ICI elle appelle Prisma
  const user = await mockPrisma.user.findUnique({ where: { id: parseInt(userId) } })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  res.status(200).json(user)
}

// ============ SETUP DU TEST ============

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getUserById - EXEMPLE SIMPLE', () => {
  
  // ============ TEST 1 : CAS DE SUCCÈS ============
  test('should return 200 with user data when user exists', async () => {
    
    // -------- ARRANGE (Preparation) --------
    
    // Crée un mock Request
    const mockRequest = {
      params: { id: '1' }  // L'utilisateur demande l'ID 1
    } as unknown as Request
    
    // Crée un mock Response avec status() et json() qui se chaînent
    const mockResponse = {
      status: vi.fn().mockReturnThis(),  // Retourne 'this' pour chaîner
      json: vi.fn().mockReturnThis()     // Retourne 'this' pour chaîner
    } as unknown as Response
    
    // Mock NextFunction
    const mockNext = vi.fn() as unknown as NextFunction
    
    // -------- LA CLUE DU PATTERN --------
    // AVAIT FAUX : mockPrisma.user.findUnique({ id: 1 })  ❌
    // CORRECT :    mockPrisma.user.findUnique.mockResolvedValue({ ... }) ✅
    //
    // Cela signifie :
    // "Quand quelqu'un appelle prisma.user.findUnique(),
    //  retourne une PROMESSE qui resolve vers cet objet"
    
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      name: 'John Doe'
      // ^^^ C'est ce que tu retournes quand la fonction est appellée
    })
    
    
    // -------- ACT (Execution) --------
    await getUserById(mockRequest, mockResponse, mockNext)
    
    
    // -------- ASSERT (Verification) --------
    // Vérifie que status(200) a été appelé
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    
    // Vérifie que json() a été appelé avec l'utilisateur
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 1,
      email: 'test@example.com',
      name: 'John Doe'
    })
    
    // Vérifie que next n'a pas été appelé (pas d'erreur)
    expect(mockNext).not.toHaveBeenCalled()
  })
  
  
  // ============ TEST 2 : CAS D'ERREUR ============
  test('should throw error when user does not exist', async () => {
    
    // -------- ARRANGE --------
    
    const mockRequest = {
      params: { id: '999' }  // ID qui n'existe pas
    } as unknown as Request
    
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    } as unknown as Response
    
    const mockNext = vi.fn() as unknown as NextFunction
    
    // LA CLÉ : Retourner NULL quand l'user n'existe pas
    mockPrisma.user.findUnique.mockResolvedValue(null)
    
    
    // -------- ACT --------
    // Quand la fonction jette une erreur, elle ne va pas appeler res.json()
    // Elle va lancer une exception
    try {
      await getUserById(mockRequest, mockResponse, mockNext)
    } catch (error) {
      // On catch l'erreur expres pour le test
      mockNext(error)
    }
    
    
    // -------- ASSERT --------
    // Vérifie que status() n'a PAS été appelé (pas de réponse)
    expect(mockResponse.status).not.toHaveBeenCalled()
    
    // Vérifie que next a été appelé avec une erreur
    expect(mockNext).toHaveBeenCalled()
    const errorPassedToNext = (mockNext as any).mock.calls[0][0]
    expect(errorPassedToNext.message).toBe('User not found')
  })
  
})


// ============ EXPLICATIONS DU PATTERN ============

/*
COMPARAISON AVANT/APRÈS :

❌ FAUX (Ce que tu faisais) :
---
mockPrisma.user.findUnique({ id: 1 })  // Tu APPELLES le mock
// Résultat : undefined

✅ CORRECT (Ce que tu dois faire) :
---
mockPrisma.user.findUnique.mockResolvedValue({  // Tu CONFIGURES le mock
  id: 1,
  email: 'test@example.com'
})
// Résultat : Une PROMESSE que se résout avec cet objet


POURQUOI ?
----------
Quand le contrôleur fait :
  const user = await prisma.user.findUnique({ ... })

Vitest demande : "As-tu dit au mock user.findUnique ce qu'il doit retourner ?"
- Si oui avec .mockResolvedValue() → Il retourne ça
- Si non → Il retourne undefined


VUE D'ENSEMBLE :
-----------
1. beforeEach() : vi.clearAllMocks()    ← Reset avant chaque test

2. Test #1 (Succès) :
   - Arrange : Setup request, response, MOCK → mockResolvedValue()
   - Act : Appel fonction
   - Assert : Vérifie status(200), json(data), next NOT CALLED

3. Test #2 (Erreur) :
   - Arrange : Setup request, response, MOCK → mockResolvedValue(null)
   - Act : Appel fonction DANS UN TRY/CATCH
   - Assert : Vérifie next CALLED WITH ERROR

CLUE : Les assertions changent selon le cas (succès vs erreur)
*/
