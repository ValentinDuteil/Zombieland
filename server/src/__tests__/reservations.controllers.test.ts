// Testing reservations controller - Unit Tests
// Unit tests focus on testing individual controller functions in isolation

// Import testing utilities from Vitest framework
import { vi, test, expect, beforeEach, describe } from 'vitest'

// Import the controller functions to test
import { createReservation, deleteReservation, getAvailabilities } from '../controllers/reservations.controller.js'

// Create mock objects for Express Request, Response, and NextFunction
const mockRequest = vi.fn()
const mockResponse = vi.fn()
const mockNext = vi.fn()

// Create a mock Prisma client for isolated function testing
const mockPrisma = vi.hoisted(() => ({
  setting: { findUnique: vi.fn() },
  reservation: { groupBy: vi.fn(), create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  ticket: { findUnique: vi.fn() },
  user: { findUnique: vi.fn() }
}))

// Mock Prisma client to use our mockPrisma object
vi.mock('@prisma/client', () => ({
  PrismaClient: class { constructor() { Object.assign(this, mockPrisma) } }
}))

// Mock the argon2 password hashing library for unit tests
vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword123'),
  verify: vi.fn().mockResolvedValue(true)
}))

// Run before each test to reset mocks and setup default test doubles
beforeEach(() => {
  // Step 1: Clear previous mock calls and implementations
  // This ensures each test starts with a clean state
  vi.clearAllMocks()

  // Step 2: Create a mock Request object (simulates Express req)
  // - Must have: user, params, body properties
  mockRequest.mockReturnValue({
    user: { id: 1, role: 'MEMBER' },        // Default authenticated user
    params: { id: 1 },                       // Default route parameter
    body: {}                                  // Will be set per test
  })

  // Step 3: Create a mock Response object (simulates Express res)
  // - Must have: status, json methods that return themselves for chaining
  mockResponse.mockReturnValue({
    status: vi.fn().mockReturnThis(),       // status(200) returns res for chaining
    json: vi.fn().mockReturnThis()          // json(data) returns res for chaining
  })

  // Step 4: Create a mock NextFunction (simulates Express next)
  // - Used when you call next(error) to pass error to error handler
  mockNext.mockImplementation((error) => {
    if (error) throw error                   // If error passed, throw it
  })

})

// Main test suite for reservation controller unit tests
describe('Reservation Controller Unit Tests', () => {

  // Test suite for createReservation function
  describe('createReservation', () => {

    // Test: successful reservation creation with valid data | Expected status: 201
    test('should create reservation successfully with valid data', async () => {
      // Arrange: Setup request object with authenticated user
      const req = mockRequest()
      // Arrange: Setup request body with reservation data
      req.body = {
        nb_tickets: 1,
        date: '2027-06-18',
        id_TICKET: 1,
        id_USER: 1
      }
      // Arrange: Mock database responses for valid scenario
      mockPrisma.setting.findUnique.mockResolvedValue({ value: '100' })
      mockPrisma.reservation.findUnique.mockResolvedValue({
        id_RESERVATION: 1,
        nb_tickets: 1,
        date: new Date('2027-06-18'),
        id_TICKET: 1,
        id_USER: 1,
        total_amount: 128,
        status: 'CONFIRMED',
        user: { firstname: 'doe', lastname: 'john', email: 'john.doe@example.com' }

      })
      mockPrisma.reservation.groupBy.mockResolvedValue([{
        _sum: { nb_tickets: 1 }
      }])
      mockPrisma.ticket.findUnique.mockResolvedValue({
        id_TICKET: 1,
        amount: 128
      })
      mockPrisma.reservation.create.mockResolvedValue({
        id_RESERVATION: 1,
        nb_tickets: 1,
        date: new Date('2027-06-18'),
        id_TICKET: 1,
        id_USER: 1,
        total_amount: 128,
        status: 'CONFIRMED'
      })
      // Arrange: Setup response object mock
      const res = mockResponse()
      const next = mockNext

      // Act: Call the createReservation function directly with mock request, response, next
      try {
        await createReservation(req, res, next)
      } catch (err) {
        next(err)
      }
      // Assert: Verify response status was set to 201
      expect(res.status).toHaveBeenCalledWith(201)
      expect(next).not.toHaveBeenCalled()
      // Assert: Verify response.json was called with reservation data
      expect(res.json).toHaveBeenLastCalledWith({
        id_RESERVATION: 1,
        nb_tickets: 1,
        date: new Date('2027-06-18'),
        id_TICKET: 1,
        id_USER: 1,
        total_amount: 128,
        status: 'CONFIRMED',
        user: { firstname: 'doe', lastname: 'john', email: 'john.doe@example.com' }
      })
    })



    // Test: throw error when user is not authenticated | Expected status: 401
    test('should throw UnauthorizedError when user is not authenticated', async () => {
      // Arrange: Setup request object WITHOUT user
      const req = mockRequest()
      req.user = undefined
      req.body = {
        nb_tickets: 1,
        date: '2027-06-18',
        id_TICKET: 1
      }

      // Arrange: Setup response mock
      const res = mockResponse()
      const next = vi.fn()
      // Act: Call createReservation without authenticated user
      try {
        await createReservation(req, res, next)
      } catch (err) {
        next(err)
      }
      // Assert: Verify next was called with UnauthorizedError
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401 })
      )
    })

    // Test: throw error when date is invalid | Expected status: 400
    test('should throw BadRequestError when date is invalid', async () => {
      // Arrange: Setup request with authenticated user
      const req = mockRequest()
      req.body = {
        nb_tickets: 1,
        date: 'invalid-date-format',
        id_TICKET: 1
      }
      // Arrange: Setup response mock
      const res = mockResponse()
      const next = vi.fn()
      // Act: Call createReservation with invalid date
      try {
        await createReservation(req, res, next)
      } catch (err) {
        next(err)
      }
      // Assert: Verify next was called with BadRequestError
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400 })
      )
    })

    // Test: throw error when ticket does not exist | Expected status: 404
    test('should throw NotFoundError when ticket does not exist', async () => {
      // Arrange: Setup request with authenticated user
      const req = mockRequest()
      // Arrange: Setup request body with reservation data
      req.body = {
        nb_tickets: 1,
        date: '2027-06-18',
        id_TICKET: 2,

      }
      // Arrange: Mock database to return null for ticket
      mockPrisma.setting.findUnique.mockResolvedValue({ value: '100' })
      mockPrisma.reservation.groupBy.mockResolvedValue([{
        _sum: { nb_tickets: 1 }
      }])
      mockPrisma.ticket.findUnique.mockResolvedValue(null)
      const res = mockResponse()
      const next = vi.fn()
      // Act: Call createReservation function
      try {
        await createReservation(req, res, next)
      } catch (err) {
        next(err)
      }
      // Assert: Verify next was called with NotFoundError
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404 })
      )
    })

    // Test: throw ConflictError when capacity is exceeded | Expected status: 409
    test('should throw ConflictError when capacity is exceeded', async () => {
      // Arrange: Setup request with authenticated user
      const req = mockRequest()
      // Arrange: Setup request body requesting more tickets than available
      req.body = {
        nb_tickets: 2,
        date: '2027-06-18',
        id_TICKET: 1
      }
      // Arrange: Mock database responses where 95/100 spots are taken
      mockPrisma.setting.findUnique.mockResolvedValue({
        value: '100'
      })
      mockPrisma.reservation.groupBy.mockResolvedValue([{
        _sum: { nb_tickets: 99 }
      }])
      mockPrisma.ticket.findUnique.mockRejectedValue({
        id_ticket: 1,
        amount: 128
      })
      const res = mockResponse()
      const next = vi.fn()
      // Act: Call createReservation function
      try {
        await createReservation(req, res, next)
      } catch (err) {
        next(err)
      }
      // Assert: Verify next was called with ConflictError
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 409 })
      )
    })

  })

  // Test suite for deleteReservation function
  describe('deleteReservation', () => {

    // Test: successful reservation deletion with valid data | Expected status: 200
    test('should delete reservation successfully with valid data', async () => {
      // Arrange: Setup request object with authenticated user and reservation ID
      const req = mockRequest()
      req.body = {
        nb_tickets: 1,
        date: '2027-06-18',
        id_TICKET: 1,
        id_USER: 1,
        id_RESERVATION: 1
      }
      // Arrange: Setup request body with password
      req.body= {password:'motdepasse'}
      // Arrange: Mock database to return existing reservation
      mockPrisma.reservation.findUnique.mockResolvedValue({
        id_RESERVATION: 1,
        user:{
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com'
        }
      })
      // Arrange: Mock database to return user with matching password
      mockPrisma.user.findUnique.mockResolvedValue({
        user:{
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com'
        },
        password: 'monmotdepasse'
      })
      
      mockPrisma.reservation.update.mockResolvedValue({
        d_RESERVATION: 1,
        status: 'CANCELLED'
      })
      // Arrange: Setup response mock
      const res = mockResponse()
      const next = mockNext
      // Act: Call deleteReservation function directly
      try {
        await deleteReservation(req, res, next)
      } catch (err) {
        next(err)
      }
      // Assert: Verify response status was set to 200
      expect(res.status).toHaveBeenCalledWith(200)
      expect(next).not.toHaveBeenCalled()
      // Assert: Verify response.json was called with success message
      expect(res.json).toHaveBeenLastCalledWith({
        message: 'Votre annulation a bien été prise en compte'
      })
    })

    // Test: throw error when reservation does not exist | Expected status: 404
    test('should throw NotFoundError when reservation does not exist', async () => {
      // Arrange: Setup request with authenticated user and reservation ID

      // Arrange: Mock database to return null for reservation

      // Act: Call deleteReservation function

      // Assert: Verify next was called with NotFoundError

    })

    // Test: throw error when user is not owner of reservation | Expected status: 403
    test('should throw ForbiddenError when user is not reservation owner', async () => {
      // Arrange: Setup request with authenticated user ID different from reservation owner

      // Arrange: Mock database to return reservation owned by different user

      // Act: Call deleteReservation function

      // Assert: Verify next was called with ForbiddenError

    })

    // Test: throw error when password is incorrect | Expected status: 401
    test('should throw UnauthorizedError when password is incorrect', async () => {
      // Arrange: Setup request with authenticated user

      // Arrange: Mock database to return existing reservation and user

      // Arrange: Mock argon2.verify to return false for wrong password

      // Act: Call deleteReservation function with wrong password

      // Assert: Verify next was called with UnauthorizedError

    })

  })

  // Test suite for getAvailabilities function
  describe('getAvailabilities', () => {

    // Test: retrieve available slots for a date | Expected status: 200
    test('should return available slots for requested date', async () => {
      // Arrange: Setup request with query parameter for date

      // Arrange: Mock database to return max capacity setting

      // Arrange: Mock database to return existing reservations for date

      // Arrange: Setup response mock

      // Act: Call getAvailabilities function

      // Assert: Verify response status was set to 200

      // Assert: Verify response contains calculated available spots

    })

    // Test: return full capacity when no reservations exist | Expected status: 200
    test('should return full capacity when no reservations exist', async () => {
      // Arrange: Setup request with query parameter for date

      // Arrange: Mock database to return max capacity setting

      // Arrange: Mock database to return empty reservations

      // Arrange: Setup response mock

      // Act: Call getAvailabilities function

      // Assert: Verify response.json was called with max capacity value

    })

  })

})