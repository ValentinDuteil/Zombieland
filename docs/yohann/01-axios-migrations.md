@@ -0,0 +1,217 @@
# Axios Migration — fetch → axios

## Why axios instead of fetch?

- Automatic JSON parsing (`response.data` instead of `response.json()`)
- Built-in error throwing on 4xx/5xx (no need to check `response.ok`)
- `isAxiosError()` type guard for precise error handling
- Cleaner syntax for DELETE with body, FormData, etc.

---

## Setup

```bash
npm install axios
```

Create `client/src/lib/axios.ts` (optional global config) or import directly:

```ts
import axios, { isAxiosError } from 'axios'
const API_URL = import.meta.env.VITE_API_URL
```

Always add `{ withCredentials: true }` to send the httpOnly cookie.

---

## Patterns

### Basic GET

```ts
const response = await axios.get(`${API_URL}/api/resource`, { withCredentials: true })
const data = response.data
```

### Basic POST

```ts
const response = await axios.post(`${API_URL}/api/resource`, { field1, field2 }, { withCredentials: true })
```

### DELETE with body

```ts
await axios.delete(`${API_URL}/api/resource/${id}`, {
  data: { password },
  withCredentials: true
})
```

> Note: with axios, the body goes in `{ data: ... }` for DELETE, not as second argument.
### FormData (file upload)

```ts
const formData = new FormData()
formData.append('image', file)

await axios.post(`${API_URL}/api/upload`, formData, {
  withCredentials: true,
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

> Pass `formData` directly, not `{ formData }`.
---

## Error handling patterns

### Simple catch

```ts
catch (error) {
  if (isAxiosError(error)) {
    setMessage(error.response?.data.message || 'Une erreur est survenue.')
  } else {
    setMessage('Une erreur est survenue.')
  }
}
```

### With Zod field-level errors (from server)

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
      setMessage(error.response?.data.message || 'Une erreur est survenue.')
    }
  } else {
    setMessage('Une erreur est survenue.')
  }
}
```

### 401 handling (open login modal)

```ts
catch (error) {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      setIsLoginModalOpen(true)
      setMessage('Veuillez vous connecter pour continuer.')
      return
    } else {
      setMessage(error.response?.data.message || 'Une erreur est survenue.')
    }
  } else {
    setMessage('Une erreur est survenue.')
  }
}
```

### Two-step operation (create + upload)

Use `let errorMessage` to handle errors across multiple steps:

```ts
let errorMessage = 'Une erreur est survenue.'

try {
  // Step 1
  const res = await axios.post(`${API_URL}/api/attractions`, { name }, { withCredentials: true })
  const id = res.data.id

  // Step 2
  errorMessage = 'Attraction créée mais erreur lors de l\'upload.'
  const formData = new FormData()
  formData.append('image', file)
  await axios.post(`${API_URL}/api/attractions/${id}/image`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  setMessage('Attraction créée avec succès.')
} catch (error) {
  if (isAxiosError(error)) {
    setMessage(error.response?.data.message || errorMessage)
  } else {
    setMessage(errorMessage)
  }
}
```

---

## Loading state pattern

Always use `finally` to reset loading:

```ts
setLoading(true)
try {
  // ...
} catch (error) {
  // ...
} finally {
  setLoading(false)
}
```

---

## Security — generic error on login

Do NOT expose server error messages on login (email enumeration):

```ts
catch (error) {
  setMessage('Email ou mot de passe invalide.')
  // Never: setMessage(error.response?.data.message)
}
```

---

## Files migrated

| File | Notes |
|------|-------|
| `AdminGuard.tsx` | GET /auth/me, redirect to /login on error |
| `Header.tsx` | GET /auth/me + POST /auth/logout |
| `LoginModal.tsx` | POST /auth/login, generic error message |
| `Register.tsx` | POST /auth/register, Zod field-level errors |
| `Login.tsx` | POST /auth/login |
| `MyReservations.tsx` | GET /reservations/me or /user/:id, DELETE with password |
| `Reservation.tsx` | GET /availabilities, POST /reservations, 401 → modal |
| `AdminAttractionCreate.tsx` | POST /attractions + POST image, two-step with let errorMessage |
| `AdminAttractionEdit.tsx` | GET + PUT /attractions/:id |
| `AdminAttractions.tsx` | GET /attractions, DELETE /attractions/:id |
| `AdminMembers.tsx` | GET /users |
| `AdminReservations.tsx` | GET /reservations |
| `AdminReservationDetail.tsx` | GET /reservations/:id |
| `Profile.tsx` | GET + PUT /users/:id |
| `DeleteAccount.tsx` | DELETE /users/:id with password |

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| `{ formData }` wrapping FormData | Pass `formData` directly |
| `error.response?.data` displays `[object Object]` | Add `.message` |
| `error.response?.data.status` for HTTP code | Use `error.response?.status` |
| `const isAxios = isAxiosError(error)` then `.response` on it | `isAxiosError` is a boolean type guard, not an object |
| `errors[name]` with state variable | Use `errors['name']` with string literal |
| Two states conflict: `setError` for both string and Record | Separate into `error: string\|null` and `errors: Record<string, string>` |