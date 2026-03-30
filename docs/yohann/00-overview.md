@@ -0,0 +1,76 @@
# Zombieland — Code Review Overview

## Sessions Summary

This folder documents everything covered during the code review and improvement sessions.

---

## Files

| File | Content |
|------|---------|
| `01-axios-migration.md` | Migration from `fetch` to `axios` across 15+ frontend files |
| `02-security-fixes.md` | 4 security fixes (authorization, cookies, rate limiting, upload) |
| `03-bruno-setup.md` | Bruno API client setup and testing guide |

---

## What was done

### 1. Axios migration (client)
Migrated all 28 `fetch` calls across 17 files to `axios` with proper error handling using `isAxiosError`.

Branch: `feat/axios-migration`

### 2. Zod validation (server + client)
- Added `validate(attractionSchema)` middleware on `POST /api/attractions`
- Added field-level error display in `AdminAttractionCreate.tsx`

### 3. Security fixes
All fixes committed on branch `claude/zombieland-code-review-KEvAL`

| Fix | Commit |
|-----|--------|
| Authorization on user profiles | `fix(users): add authorization check on getProfile and deleteProfile` |
| Cookie secure flag | `fix(auth): set secure cookie flag based on NODE_ENV` |
| Rate limiting | `feat(security): add rate limiting on auth routes` |
| Upload size limit | `fix(upload): add file size limit to prevent DoS attacks` |

---

## Remaining improvements (next steps)

### High priority
- [ ] Unit tests with Vitest (critical for CDA titre professionnel)
- [ ] `sameSite: 'lax'` instead of `'none'` (better CSRF protection when frontend/backend on same domain)

### Medium priority
- [ ] CORS configuration (whitelist specific origins instead of `*`)
- [ ] Pagination on list endpoints (attractions, reservations, users)
- [ ] Error boundaries in React (catch rendering errors)

### Low priority
- [ ] Server-side logging (Winston or Pino)
- [ ] Refresh token mechanism (current JWT expires in 7 days, no way to revoke)
- [ ] Input sanitization on text fields (XSS via DB)

---

## Architecture reminder

```
client/          → React + Vite + TypeScript
  src/
    components/  → AdminGuard, Header, LoginModal...
    pages/       → Register, Login, Reservation, MyReservations...
    pages/admin/ → AdminAttractions, AdminMembers, AdminReservations...
server/          → Express + TypeScript + Prisma
  src/
    controllers/ → auth, users, attractions, reservations...
    middlewares/ → auth, validate, rateLimit, upload...
    routes/      → auth, users, attractions, reservations...
    schemas/     → Zod schemas (auth.schema, attraction.schema...)
    utils/       → AppError (BadRequestError, UnauthorizedError...)
``