import { vi, describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import { Request, Response, NextFunction } from "express"

// --- MOCKS ------------------------------------------------------------------

// Prisma mock hoisted
const mockPrisma = vi.hoisted(() => ({
  reservation: { groupBy: vi.fn(), findUnique: vi.fn(), create: vi.fn(), findMany: vi.fn(), delete: vi.fn(), update: vi.fn() },
  user: { findUnique: vi.fn(), create: vi.fn(), findMany: vi.fn(), delete: vi.fn(), update: vi.fn() },
  ticket: { findUnique: vi.fn() },
  setting: { findUnique: vi.fn() }
}))

// Mock Prisma BEFORE importing app
vi.mock("../../lib/prisma.js", () => ({
  prisma: mockPrisma
}))

// Mock middleware auth BEFORE importing app
const mockCheckToken = vi.hoisted(() => vi.fn())
vi.mock("../../middlewares/auth.middleware.js", () => ({
  checkToken: mockCheckToken
}))

// Mock argon2 BEFORE importing app
vi.mock("argon2", () => ({
  verify: vi.fn().mockResolvedValue(true)
}))

// Import app AFTER mocks
import app from "../../app.js"

// ---------------------------------------------------------------------------

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()

  // Default: ADMIN authenticated
  mockCheckToken.mockImplementation(
    (req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
      req.user = { id: 1, role: "ADMIN" }
      next()
    }
  )
})

// ---------------------------------------------------------------------------
// TESTS D’INTÉGRATION
// ---------------------------------------------------------------------------

describe("GET /api/users - integrationTest", () => {
  beforeEach(() => {
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id_USER: 1,
        email: "test@test.com",
        firstname: "John",
        lastname: "Doe",
        role: "ADMIN",
        created_at: new Date(),
        _count: { reservations: 0 }
      }
    ])
  })

  it("should return 200 and a list of users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", "Bearer faketoken")

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// GET /api/users/:id
// ---------------------------------------------------------------------------

describe("GET /api/users/:id - integrationTest", () => {
 it("should return 200 when user exists", async () => {

  mockCheckToken.mockImplementation((req, res, next) => {
    req.user = { id: 1, role: "ADMIN" }
    next()
  })

  mockPrisma.user.findUnique.mockResolvedValue({
    id_USER: 1,
    email: "john@test.com",
    firstname: "John",
    lastname: "Doe",
    role: "ADMIN"
  })

  const res = await request(app)
    .get("/api/users/1/profile")   // <-- ROUTE CORRECTE
    .set("Cookie", ["token=faketoken"])

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty("id_USER", 1)
})

 it("should return 400 for invalid ID", async () => {

  mockCheckToken.mockImplementation((req, res, next) => {
    req.user = { id: 1, role: "ADMIN" }
    next()
  })

  mockPrisma.user.findUnique.mockReset()

  const res = await request(app)
    .get("/api/users/abc/profile")   // <-- ROUTE CORRECTE
    .set("Cookie", ["token=faketoken"])

  expect(res.status).toBe(400)
})

  it("should return 404 when user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const res = await request(app)
      .get("/api/users/999")
      .set("Authorization", "Bearer faketoken")

    expect(res.status).toBe(404)
  })
})

// ---------------------------------------------------------------------------
// PUT /api/users/:id
// ---------------------------------------------------------------------------

describe("PUT /api/users/:id - integrationTest", () => {
  it("should return 200 when profile is updated", async () => {

  mockCheckToken.mockImplementation((req, res, next) => {
    req.user = { id: 1, role: "ADMIN" }
    next()
  })

  mockPrisma.user.findUnique.mockResolvedValue({
    id_USER: 1,
    password: "hashed"
  })

  mockPrisma.user.update.mockResolvedValue({
    id_USER: 1,
    email: "new@test.com",
    firstname: "John",
    lastname: "Doe",
    role: "ADMIN"
  })

  const res = await request(app)
    .patch("/api/users/1/profile")   // <-- ROUTE CORRECTE
    .set("Cookie", ["token=faketoken"])
    .send({ email: "new@test.com" })

  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty("email", "new@test.com")
})

it("should return 400 for invalid ID", async () => {

  mockCheckToken.mockImplementation((req, res, next) => {
    req.user = { id: 1, role: "ADMIN" }
    next()
  })

  mockPrisma.user.findUnique.mockReset()

  const res = await request(app)
    .patch("/api/users/abc/profile")   // <-- ROUTE CORRECTE
    .set("Cookie", ["token=faketoken"])
    .send({ email: "new@test.com" })

  expect(res.status).toBe(400)
})

  it("should return 404 when user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const res = await request(app)
      .put("/api/users/999")
      .set("Authorization", "Bearer faketoken")
      .send({ email: "new@test.com" })

    expect(res.status).toBe(404)
  })
})

// ---------------------------------------------------------------------------
// DELETE /api/users/:id
// ---------------------------------------------------------------------------

describe("DELETE /api/users/:id - integrationTest", () => {
  it("should return 200 when profile is deleted", async () => {
    // Dynamic mock for findUnique
    mockPrisma.user.findUnique.mockImplementation(({ where }) => {
      if (where.id_USER === 1) {
        return Promise.resolve({ id_USER: 1, password: "hashed" }) // admin
      }
      if (where.id_USER === 2) {
        return Promise.resolve({ id_USER: 2 }) // user to delete
      }
      return Promise.resolve(null)
    })

    mockPrisma.user.delete.mockResolvedValue({})

    const res = await request(app)
      .delete("/api/users/2")
      .set("Authorization", "Bearer faketoken")
      .send({ password: "adminpass" })

    expect(res.status).toBe(200)
  })

it("should return 400 for invalid ID", async () => {

  // 1. Mock checkToken pour éviter 401
  mockCheckToken.mockImplementation((req, res, next) => {
    req.user = { id: 1, role: "ADMIN" }
    next()
  })

  // 2. Empêcher Prisma d'interférer
  mockPrisma.user.findUnique.mockReset()

  const res = await request(app)
    .delete("/api/users/abc")        // bonne route
    .set("Cookie", ["token=faketoken"]) // checkToken a besoin d'un cookie
    .send({ password: "adminpass" }) // obligatoire pour éviter 401

  expect(res.status).toBe(400)
})

  it("should return 404 when user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const res = await request(app)
      .delete("/api/users/999")
      .set("Authorization", "Bearer faketoken")
      .send({ password: "adminpass" })

    expect(res.status).toBe(404)
  })
})