import rateLimit from 'express-rate-limit'

// Rate limiter middleware from express-rate-limit
export const authLimiter = rateLimit({
  // Time window in milliseconds (15 minutes)
  windowMs: 15 * 60 * 1000,
  // Max 10 requests per IP per window (brute force protection)
  max: 400,
  // Response sent when limit is exceeded
  message : { message: 'Trop de tentatives, réessayez dans 15 minutes.' },
  // Send RateLimit headers in the response
  standardHeaders : true,
  // Disable deprecated X-RateLimit headers
  legacyHeaders : false
})

export const globalLimiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  // Max 100 requests per IP per window
  max: 400,
  message : { message: 'Trop de requêtes, réessayez plus tard.' },
  standardHeaders : true,
  legacyHeaders : false
})

