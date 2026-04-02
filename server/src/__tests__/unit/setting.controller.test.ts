// Testing setting controller

// SETUP
// =====

vi.mock('../../lib/prisma.js', () => ({
    prisma: {
        setting: {
            findUnique: vi.fn(),
            update: vi.fn()
        },
        user: {
            findUnique: vi.fn()
        }
    }
}))

vi.mock('argon2', () => ({
    verify: vi.fn()
}))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMaxTickets, updateMaxTickets } from '../../controllers/setting.controller.js'
import { prisma } from '../../lib/prisma.js'
import * as argon2 from 'argon2'

const fakeSetting = { key: 'max_tickets_per_day', value: '9999', updated_at: new Date() }
const fakeAdmin = { id_USER: 1, password: 'hashedPassword' }

beforeEach(() => { vi.clearAllMocks() })

// GET MAX TICKETS
// ===============

describe('getMaxTickets', () => {

    it('should return 404 if setting does not exist', async () => {
        // ARRANGE
        vi.mocked(prisma.setting.findUnique).mockResolvedValue(null)
        const req = {} as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        // ACT
        try { await getMaxTickets(req, res, next) } catch (err) { next(err) }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 404 })
        )
    })

    it('should return 200 with current max tickets value', async () => {
        // ARRANGE
        vi.mocked(prisma.setting.findUnique).mockResolvedValue(fakeSetting)
        const req = {} as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        // ACT
        try { await getMaxTickets(req, res, next) } catch (err) { next(err) }

        // ASSERT
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ value: 9999 })
    })
})

// UPDATE MAX TICKETS
// ==================

describe('updateMaxTickets', () => {

    it('should return 404 if admin does not exist', async () => {
        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
        const req = { user: { id: 1 }, body: { value: 5000, password: 'Password1!' } } as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        // ACT
        try { await updateMaxTickets(req, res, next) } catch (err) { next(err) }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 404 })
        )
    })

    it('should return 401 if password is incorrect', async () => {
        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeAdmin as any)
        vi.mocked(argon2.verify).mockResolvedValue(false)
        const req = { user: { id: 1 }, body: { value: 5000, password: 'wrongPassword' } } as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        // ACT
        try { await updateMaxTickets(req, res, next) } catch (err) { next(err) }

        // ASSERT
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401 })
        )
    })

    it('should return 200 on successful update', async () => {
        // ARRANGE
        vi.mocked(prisma.user.findUnique).mockResolvedValue(fakeAdmin as any)
        vi.mocked(argon2.verify).mockResolvedValue(true)
        vi.mocked(prisma.setting.update).mockResolvedValue(fakeSetting)
        const req = { user: { id: 1 }, body: { value: 5000, password: 'Password1!' } } as any
        const res = { json: vi.fn() } as any
        const next = vi.fn()

        // ACT
        try { await updateMaxTickets(req, res, next) } catch (err) { next(err) }

        // ASSERT
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ message: 'Plafond mis à jour avec succès' })
    })
})