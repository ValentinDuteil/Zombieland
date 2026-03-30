# Security Fixes

## Overview

| # | Point | Fichier(s) | Commit |
|---|-------|-----------|--------|
| 1 | Authorization check on user profiles | `users.controller.ts` | `fix(users): add authorization check on getProfile and deleteProfile` |
| 2 | Cookie secure flag based on NODE_ENV | `auth.controller.ts` | `fix(auth): set secure cookie flag based on NODE_ENV` |
| 3 | Rate limiting on auth routes | `rateLimit.middleware.ts`, `auth.routes.ts` | `feat(security): add rate limiting on auth routes` |
| 4 | File upload size limit | `upload.middleware.ts` | `fix(upload): add file size limit to prevent DoS attacks` |

---

## Point 1 — Authorization check on user profiles

### Problem
Any logged-in user could view or delete any other user's profile by changing the `:id` in the URL.

### Fix — `server/src/controllers/users.controller.ts`

In `getProfile` and `deleteProfile`, add before any DB query:

```ts
if (req.user.role !== 'ADMIN' && id !== req.user.id) {
  throw new ForbiddenError('Accès interdit')
}
```

### Logic
- ADMIN can access any profile
- A MEMBER can only access their own profile (`id === req.user.id`)
- Anyone else gets a 403 Forbidden

---

## Point 2 — Cookie secure flag based on NODE_ENV

### Problem
`secure: true` forces HTTPS. In development (HTTP/localhost), the cookie was never sent, breaking authentication.

### Fix — `server/src/controllers/auth.controller.ts`

In `register`, `login`, and `logout` (3 locations):

```ts
res.cookie('token', token, {
  httpOnly: true,                                      // JavaScript can't read it → XSS protection
  secure: process.env.NODE_ENV === 'production',       // true in production (HTTPS), false in development (HTTP)
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000
})
```

### `.env` file

```env
NODE_ENV=development
```

### Production (Render, Railway, etc.)
Set `NODE_ENV=production` in the platform's environment variables. The cookie will automatically use `secure: true`.

---

## Point 3 — Rate limiting on auth routes

### Problem
Without rate limiting, anyone can attempt thousands of passwords on `/api/auth/login` without being blocked (brute force attack).

### Install

```bash
cd server
npm install express-rate-limit
```

### New file — `server/src/middlewares/rateLimit.middleware.ts`

```ts
// Rate limiter middleware from express-rate-limit
import rateLimit from 'express-rate-limit'

// Strict limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Time window in milliseconds (15 minutes)
  max: 10,                    // Max 10 requests per IP per window (brute force protection)
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes.' }, // Response sent when limit is exceeded
  standardHeaders: true,      // Send RateLimit headers in the response
  legacyHeaders: false        // Disable deprecated X-RateLimit headers
})

// Global limiter for all other routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Time window in milliseconds (15 minutes)
  max: 100,                   // Max 100 requests per IP per window
  message: { message: 'Trop de requêtes, réessayez plus tard.' }, // Response sent when limit is exceeded
  standardHeaders: true,      // Send RateLimit headers in the response
  legacyHeaders: false        // Disable deprecated X-RateLimit headers
})
```

### Apply in `server/src/routes/auth.routes.ts`

```ts
import { authLimiter } from '../middlewares/rateLimit.middleware.js'

router.post('/register', authLimiter, validate(UserSchema), register)
router.post('/login', authLimiter, validate(LoginSchema), login)
```

Order: `authLimiter → validate → controller`
Block spamming IPs first, then validate data.

### Test

```bash
for i in {1..12}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'; done
```

Expected: first 10 responses are `401`, then `429` from the 11th.

---

## Point 4 — File upload size limit

### Problem
Without a size limit, someone can upload a multi-gigabyte file and crash the server (DoS attack).

### Fix — `server/src/middlewares/upload.middleware.ts`

Add a `limits` variable and pass it to `multer({})`:

```ts
// Limit file size to 5MB to prevent DoS attacks
const limits = { fileSize: 5 * 1024 * 1024 }

export const upload = multer({ storage, fileFilter, limits })
```

`5 * 1024 * 1024` = 5,242,880 bytes = 5 MB.

---

## Bonus — Zod validation on attraction routes

### Problem
`POST /api/attractions` had no input validation, allowing invalid data into the database.

### Fix — `server/src/routes/attraction.routes.ts`

```ts
import { validate } from '../middlewares/validate.middleware.js'
import { attractionSchema } from '../schemas/attraction.schema.js'

router.post('/', checkToken, checkRole("ADMIN"), validate(attractionSchema), createAttraction)
```

### Frontend — display field-level errors (`AdminAttractionCreate.tsx`)

```ts
catch (error) {
  if (isAxiosError(error)) {
    if (error.response?.data.details) {
      const newErrors: Record<string, string> = {}
      error.response?.data.details.forEach((d: { champ: string, message: string }) => {
        newErrors[d.champ] = d.message
      })
      setErrors(newErrors)
    } else {
      setError(error.response?.data.message || 'Une erreur est survenue.')
    }
  } else {
    setError('Une erreur est survenue.')
  }
}
```

Two separate states:
- `errors: Record<string, string>` — field-level errors from Zod
- `error: string | null` — generic error message