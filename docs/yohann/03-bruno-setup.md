# Bruno API Client — Setup & Testing

## Why Bruno?

Bruno is a local-first API client (like Postman/Thunder Client) that stores collections as files in your project. No cloud sync, no account required.

---

## Setup

1. Download Bruno desktop from [usebruno.com](https://www.usebruno.com/)
2. Create a new collection in your project folder (Windows path if using WSL)
3. Set the base URL to `http://localhost:3000`

> If your project is in WSL and Bruno is on Windows, point Bruno to `localhost:3000` — WSL exposes ports to Windows automatically.
---

## Environment configuration

Create an environment in Bruno with:

| Variable | Value |
|----------|-------|
| `baseUrl` | `http://localhost:3000` |

---

## Cookie handling

Bruno desktop handles cookies automatically via its cookie jar. After a successful login request, the `token` cookie is stored and sent with subsequent requests automatically.

If cookies don't work between requests, check:
- That `withCredentials` is set on the server (CORS)
- That `secure: false` in development (see security fixes Point 2)
- That `sameSite` is compatible with your setup

---

## Key requests to set up

### Auth

| Method | URL | Body |
|--------|-----|------|
| POST | `/api/auth/register` | `{ email, firstname, lastname, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/auth/me` | — |
| POST | `/api/auth/logout` | — |

### Users

| Method | URL | Notes |
|--------|-----|-------|
| GET | `/api/users/:id` | Requires auth, own profile or ADMIN |
| DELETE | `/api/users/:id` | Body: `{ password }` |

### Attractions

| Method | URL | Notes |
|--------|-----|-------|
| GET | `/api/attractions` | Public |
| POST | `/api/attractions` | ADMIN only |
| PUT | `/api/attractions/:id` | ADMIN only |
| DELETE | `/api/attractions/:id` | ADMIN only |

---

## Testing rate limiting

Use this curl command to trigger the rate limiter (Point 3):

```bash
for i in {1..12}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'; done
```

Expected output: `401` x10, then `429` x2.

---

## Testing authorization (Point 1)

1. Login as a MEMBER → get their token cookie
2. Try GET `/api/users/:id` with another user's ID
3. Expected: `403 Forbidden` with `{ message: 'Accès interdit' }`
4. Login as ADMIN → same request → Expected: `200 OK`