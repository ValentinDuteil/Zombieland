import { vi } from 'vitest';

// Mock of the Prisma client — replaces database calls during tests
// Each method is a vi.fn() so we can control return values per test

export const prisma = {
  reservation: {
	groupBy: vi.fn(),
	findUnique: vi.fn(),
	create: vi.fn(),
  findMany: vi.fn()
  },
  user: {
	findUnique: vi.fn(),
  },
  ticket: {
	findUnique: vi.fn(),
  },
};
