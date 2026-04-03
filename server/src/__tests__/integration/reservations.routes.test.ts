// Import testing utilities from Vitest framework
import { vi, test, expect, beforeEach } from 'vitest'
// Import Express request, response and next function types
import { Request, Response, NextFunction } from 'express'


// Create a mock Prisma client that is hoisted to the top of the file
const mockPrisma = vi.hoisted(() => ({
  // Mock reservation database operations
  reservation: { groupBy: vi.fn(), findUnique: vi.fn(), create: vi.fn(), findMany: vi.fn(), delete: vi.fn(), update: vi.fn() },
  // Mock user database operations
  user: { findUnique: vi.fn() },
  // Mock ticket database operations
  ticket: { findUnique: vi.fn() },
  // Mock setting database operations
  setting: { findUnique: vi.fn() }
}))

// Create a mock function for the token authentication middleware
const mockCheckToken = vi.hoisted(() => vi.fn())

// Mock the Prisma PostgreSQL adapter
vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class { } }))
// Mock the Prisma client to use our mockPrisma object
vi.mock('@prisma/client', () => ({
  PrismaClient: class { constructor() { Object.assign(this, mockPrisma) } }
}))
// Mock CSRF middleware to bypass CSRF protection during tests
vi.mock('../../middlewares/csrf.middleware.js', () => ({
    checkCsrf: (_req: any, _res: any, next: any) => next(),
    setCsrfToken: (_req: any, res: any) => res.json({ csrfToken: 'fake-token' })
}))

// Mock the authentication middleware with our mockCheckToken
vi.mock('../../middlewares/auth.middleware.js', () => ({
  checkToken: mockCheckToken
}))

// Mock the argon2 password hashing library
vi.mock('argon2', () => ({
  verify: vi.fn().mockResolvedValue(true)
}))

// Import Supertest for making HTTP requests in tests
import supertest from 'supertest'
// Import the Express app to test
import app from '../../app.js'
// Import custom error class for unauthorized errors
import { UnauthorizedError } from '../../utils/AppError.js'
// Import argon2 for password verification
import * as argon2 from 'argon2'
import { describe } from 'node:test'

// Run before each test to reset mocks and set default behavior
beforeEach(() => {
  // Clear all previous mock call history and implementations
  vi.clearAllMocks()
  // Set default behavior: user is authenticated
  // Default behavior: user is authenticated with MEMBER role
  mockCheckToken.mockImplementation((req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
    // Add authenticated user to request object
    req.user = { id: 1, role: 'MEMBER' }
    // Call the next middleware
    next()
  })
})

//  1 function 
// Main test suite for reservation module
describe('Reservation module error', () => {
  // 2 scénario
  // Test suite for POST /api/reservations endpoint
  describe('POST /api/reservations', () => {

    // Test: Return 404 when ticket does not exist in database
    test('should return 404 when ticket does not exist', async () => {
      // Arrange
      // Setup: Mock max capacity setting and return empty reservations and null ticket
      mockPrisma.setting.findUnique.mockResolvedValue({ value: '9999' })
      mockPrisma.reservation.groupBy.mockResolvedValue([])
      mockPrisma.ticket.findUnique.mockResolvedValue(null)
      // Act
      // Execute: Send POST request with non-existent ticket ID
      const response = await supertest(app).post('/api/reservations').send({
        nb_tickets: 1,
        date: '2027-06-15',
        id_TICKET: 999
      });
      // Assert
      // Verify: Response logs and expects 404 status code
      console.log('STATUS:', response.status)
      console.log('BODY:', response.body)

      expect(response.status).toEqual(404)
    });
    // 3 result
    test('should return 401 when user is not authenticated', async () => {
      // Arrange - Override the mock to NOT add req.user
      // Setup: Override default middleware to simulate unauthenticated access
      mockCheckToken.mockImplementationOnce((req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
        next(new UnauthorizedError('Token manquant'))
      });
      // Act
      // Execute: Send POST request without valid authentication token
      const response = await supertest(app).post('/api/reservations').send({
        nb_tickets: 1,
        date: '2027-06-15',
        id_TICKET: 1
      });
      // Assert
      // Verify: Expect 401 unauthorized status code
      expect(response.status).toEqual(401);
    });

    test('should return 404 when user does not exist (admin flow)', async () => {
      // Arrange
      // Setup: Mock empty reservations and non-existent user
      mockPrisma.reservation.groupBy.mockResolvedValue([]);
      mockPrisma.user.findUnique.mockResolvedValue(null);
      // Act
      // Execute: Send POST request with admin creating reservation for non-existent user
      const response = await supertest(app).post('/api/reservations').send({        nb_tickets: 1,
        date: '2027-06-15',
        id_TICKET: 1,        id_USER: 999
      });
      // Assert
      // Verify: Expect 404 when user does not exist
      expect(response.status).toEqual(404);
    });

    test('should return 400 when date is invalid', async () => {
      // Arrange
      // Setup: Mock the max capacity setting
      mockPrisma.setting.findUnique.mockResolvedValue({
        value: '9999'
      });
      // ACT
      // Execute: Send POST request with invalid date format
      const response = await supertest(app).post('/api/reservations').send({
        date: 'pas-une-date'
      });
      // Assert
      // Verify: Expect 400 bad request status code for invalid date
      expect(response.status).toEqual(400)
    });

    test('should return 201 when reservation is created successfully', async () => {
      // Arrange - Available slots
      // Setup: Mock max capacity of 100 tickets per day (20 already booked)
      mockPrisma.setting.findUnique.mockResolvedValue({ value: '100' });
      mockPrisma.reservation.groupBy.mockResolvedValue([
        { date: new Date('2027-06-15'), _sum: { nb_tickets: 20 } }
      ]);
      // Setup: Mock available ticket details
      mockPrisma.ticket.findUnique.mockResolvedValue({
        id_TICKET: 1,
        name: 'VIP Ticket',
        amount: 50
      });
      // Setup: Mock the newly created reservation
      mockPrisma.reservation.create.mockResolvedValue({
        id_RESERVATION: 1,
        nb_tickets: 10,
        date: new Date('2027-06-15'),
        id_TICKET: 1,
        id_USER: 1,
        total_amount: 500,
        status: 'CONFIRMED'
      });
      // Setup: Mock reservation with user details returned after creation
      mockPrisma.reservation.findUnique.mockResolvedValue({
        id_RESERVATION: 1,
        nb_tickets: 10,
        date: new Date('2027-06-15'),
        id_TICKET: 1,
        id_USER: 1,
        total_amount: 500,
        status: 'CONFIRMED',
        user: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com'
        }
      });
      // Act
      // Execute: Send POST request to create reservation with available slots
      const response = await supertest(app).post('/api/reservations').send({
        nb_tickets: 10,
        date: '2027-06-15',
        id_TICKET: 1
      });
      // Assert
      // Verify: Expect 201 created status and reservation ID in response
      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('id_RESERVATION');
    });

    test('should return 409 when capacity is exceeded', async () => {
      // Arrange - Park is full
      // Setup: Mock max capacity of 100 (95 already booked, only 5 slots left)
      mockPrisma.setting.findUnique.mockResolvedValue({ value: '100' });
      mockPrisma.reservation.groupBy.mockResolvedValue([
        { date: new Date('2027-06-15'), _sum: { nb_tickets: 95 } }
      ]);
      // Act - Try to book 10 tickets but only 5 are available
      // Execute: Attempt to book more tickets than available capacity
      const response = await supertest(app).post('/api/reservations').send({
        nb_tickets: 10,
        date: '2027-06-15',
        id_TICKET: 1
      });
      // Assert
      // Verify: Expect 409 conflict status when capacity is exceeded
      expect(response.status).toEqual(409);
    });

  });

  // Test suite for DELETE /api/reservations/:id endpoint
  describe('DELETE /api/reservations/:id', () => {

    // Test: Return 200 when successfully cancelling an existing reservation
    test('should return 200 when reservation is cancelled successfully', async () => {
      // Arrange
      // Setup: Mock finding reservation with future date (>10 days away)
      mockPrisma.reservation.findUnique.mockResolvedValue({
        id_RESERVATION: 1,
        id_USER: 1,
        date: new Date('2027-09-15'), // More than 10 days away
        status: 'CONFIRMED'
      });
      // Setup: Mock user with hashed password for verification
      mockPrisma.user.findUnique.mockResolvedValue({
        id_USER: 1,
        password: '$argon2id$v=19$m=65540,t=3,p=4$...' // Mock hashed password
      });
      // Setup: Mock successful update of reservation status to CANCELLED
      mockPrisma.reservation.update.mockResolvedValue({
        id_RESERVATION: 1,
        status: 'CANCELLED'
      });
      // Act
      // Execute: Send DELETE request with password to cancel reservation
      const response = await supertest(app).delete('/api/reservations/1').send({
        password: 'correctPassword123'
      });
      // Assert
      // Verify: Expect 200 OK status and success message in response
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('message');
    });

    // Test: Return 401 when user is not authenticated when attempting to delete
    test('should return 401 when user is not authenticated for DELETE', async () => {
      // Arrange - Override middleware to reject unauthenticated access
      // Setup: Override default middleware to simulate unauthenticated access for DELETE
      mockCheckToken.mockImplementationOnce((req: Request & { user?: { id: number; role: string } }, res: Response, next: NextFunction) => {
        next(new UnauthorizedError('Token manquant'))
      });
      // Act
      // Execute: Send DELETE request without valid authentication token
      const response = await supertest(app).delete('/api/reservations/1').send({
        password: 'somePassword'
      });
      // Assert
      // Verify: Expect 401 unauthorized status code for unauthenticated DELETE request
      expect(response.status).toEqual(401);
    });

  });
});
