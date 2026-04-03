// Testing users controller
import { vi, test, expect, beforeEach, it, describe } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { getAllUsers, getProfile, updateProfile, deleteProfile } from '../../controllers/users.controller.js'
import request from "supertest"
import app from '../../app.js'
import * as argon2 from 'argon2'


// --- MOCKS ------------------------------------------------------------------

// Mock Prisma client (hoisted)
const mockPrisma = vi.hoisted(() => ({
  reservation: { groupBy: vi.fn(), findUnique: vi.fn(), create: vi.fn(), findMany: vi.fn(), delete: vi.fn(), update: vi.fn() },
  user: { findUnique: vi.fn(), create: vi.fn(), findMany: vi.fn(), delete: vi.fn(), update: vi.fn() },
  ticket: { findUnique: vi.fn() },
  setting: { findUnique: vi.fn() }
}))

// 👉 Mock Prisma UNE SEULE FOIS pour tout le fichier
vi.mock('../../lib/prisma.js', () => ({
  prisma: mockPrisma
}))

// Mock middleware auth
const mockCheckToken = vi.hoisted(() => vi.fn())
vi.mock('../../middlewares/auth.middleware.js', () => ({
  checkToken: mockCheckToken
}))

// Mock argon2
vi.mock('argon2', () => ({
  verify: vi.fn().mockResolvedValue(true)
}))

// ---------------------------------------------------------------------------

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()

  mockCheckToken.mockImplementation(
    (req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
      req.user = { id: 1, role: 'ADMIN' }
      next()
    }
  )
})


// --- TESTS UNITAIRES --------------------------------------------------------

describe('getAllUsers - unit test', () => {

  test('should return 200 and a list of users', async () => {
    const fakeUsers = [
      { id_USER: 1, email: 'test@test.com', firstname: 'John', lastname: 'Doe', role: 'ADMIN', created_at: new Date(), _count: { reservations: 0 } },
      { id_USER: 2, email: 'test2@test.com', firstname: 'Jane', lastname: 'Doe', role: 'MEMBER', created_at: new Date(), _count: { reservations: 1 } }
    ]

    mockPrisma.user.findMany.mockResolvedValue(fakeUsers)

    const mockReq = { user: { id: 1, role: 'ADMIN' } } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    } as unknown as Response
    const mockNext = vi.fn()

    await getAllUsers(mockReq, mockRes, mockNext)

    expect(mockPrisma.user.findMany).toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(fakeUsers)
  })

  test("should throw if Prisma throws", async () => {
    const error = new Error("DB error")
    mockPrisma.user.findMany.mockRejectedValue(error)

    const req: any = { user: { id: 1, role: "ADMIN" } }
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    }
    const next = vi.fn()

    await expect(getAllUsers(req, res, next)).rejects.toThrow("DB error")

    expect(next).not.toHaveBeenCalled()
  })
})

//------------------Tests unit get profile-----------------------------
describe("getProfile - unit test", () => {

  test("ADMIN should get any profile", async () => {
    const fakeUser = {
      id_USER: 2,
      email: "john@test.com",
      firstname: "John",
      lastname: "Doe",
      password: "hashed"
    }

    mockPrisma.user.findUnique.mockResolvedValue(fakeUser)

    const req: any = { user: { id: 1, role: "ADMIN" }, params: { id: "2" } }
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    const next = vi.fn()

    await getProfile(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      id_USER: 2,
      email: "john@test.com",
      firstname: "John",
      lastname: "Doe"
    })
  })

  test("MEMBER cannot access another profile", async () => {
    const req: any = { user: { id: 1, role: "MEMBER" }, params: { id: "2" } }
    const res: any = {}
    const next = vi.fn()

    await expect(getProfile(req, res, next)).rejects.toThrow("Accès interdit")
    expect(next).not.toHaveBeenCalled()
  })

  test("should throw if ID is invalid", async () => {
    const req: any = { user: { id: 1, role: "ADMIN" }, params: { id: "abc" } }
    const res: any = {}
    const next = vi.fn()

    await expect(getProfile(req, res, next)).rejects.toThrow("ID invalide")
  })

  test("should throw if user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const req: any = { user: { id: 1, role: "ADMIN" }, params: { id: "2" } }
    const res: any = {}
    const next = vi.fn()

    await expect(getProfile(req, res, next)).rejects.toThrow("Utilisateur introuvable")
  })

  test("should throw if Prisma fails", async () => {
    const error = new Error("DB error")
    mockPrisma.user.findUnique.mockRejectedValue(error)

    const req: any = { user: { id: 1, role: "ADMIN" }, params: { id: "2" } }
    const res: any = {}
    const next = vi.fn()

    await expect(getProfile(req, res, next)).rejects.toThrow("DB error")
  })
})

//------------------Tests unit update profile-----------------------------
describe("updateProfile - unit test", () => {

  test("ADMIN can update any profile", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id_USER: 2, password: "hashed" })
    mockPrisma.user.update.mockResolvedValue({
      id_USER: 2,
      email: "new@test.com",
      firstname: "John",
      lastname: "Doe",
      role: "ADMIN"
    })

    const req: any = {
      user: { id: 1, role: "ADMIN" },
      params: { id: "2" },
      body: { email: "new@test.com" }
    }

    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    const next = vi.fn()

    await updateProfile(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
  })

  test("MEMBER cannot update another profile", async () => {
    const req: any = {
      user: { id: 1, role: "MEMBER" },
      params: { id: "2" },
      body: {}
    }
const res: any = {}
    await expect(updateProfile(req, res, vi.fn())).rejects.toThrow("Accès interdit")
  })

  test("should throw if ID invalid", async () => {
    const req: any = {
      user: { id: 1, role: "ADMIN" },
      params: { id: "abc" },
      body: {}
    }
    const res: any = {}
    await expect(updateProfile(req, res, vi.fn())).rejects.toThrow("Id invalide")
  })

  test("should throw if Zod validation fails", async () => {
    const req: any = {
      user: { id: 1, role: "ADMIN" },
      params: { id: "1" },
      body: { email: "not-an-email" }
    }
    const res: any = {}
    await expect(updateProfile(req, res, vi.fn())).rejects.toThrow("Données invalides")
  })

  test("MEMBER must provide correct password", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id_USER: 1, password: "hashed" })
    vi.mocked(argon2.verify).mockResolvedValue(false)

    const req: any = {
      user: { id: 1, role: "MEMBER" },
      params: { id: "1" },
      body: { currentPassword: "wrong" }
    }
    const res: any = {}
    await expect(updateProfile(req, res, vi.fn())).rejects.toThrow("Mot de passe incorrect")
  })

  test("should throw if Prisma fails", async () => {
    const error = new Error("DB error")
    mockPrisma.user.update.mockRejectedValue(error)

    const req: any = {
      user: { id: 1, role: "ADMIN" },
      params: { id: "1" },
      body: {}
    }
    const res: any = {}
    await expect(updateProfile(req, res, vi.fn())).rejects.toThrow("DB error")
  })
})
//------------------Tests unit delete profile-----------------------------
describe("deleteProfile - unit test", () => {
test("ADMIN can delete any profile", async () => {
  mockPrisma.user.findUnique
    .mockResolvedValueOnce({ id_USER: 2 }) // user to delete
    .mockResolvedValueOnce({ id_USER: 1, password: "hashed" }) // admin

  vi.mocked(argon2.verify).mockResolvedValue(true)

  mockPrisma.user.update.mockResolvedValue({}) // soft delete to keep the reservations in DB

  const req: any = {
    user: { id: 1, role: "ADMIN" },
    params: { id: "2" },
    body: { password: "adminpass" } // <-- OBLIGATOIRE
  }

  const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() }
  const next = vi.fn()

  await deleteProfile(req, res, next)

  expect(res.status).toHaveBeenCalledWith(200)
})

  test("MEMBER cannot delete another profile", async () => {
    const req: any = {
      user: { id: 1, role: "MEMBER" },
      params: { id: "2" }
    }
    const res: any = {}
    await expect(deleteProfile(req, res, vi.fn())).rejects.toThrow("Accès interdit")
  })

  test("should throw if ID invalid", async () => {
    const req: any = {
      user: { id: 1, role: "ADMIN" },
      params: { id: "abc" }
    }
    const res: any = {}
    await expect(deleteProfile(req, res, vi.fn())).rejects.toThrow("Id invalide")
  })
})
