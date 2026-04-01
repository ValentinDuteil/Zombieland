# 🧪 GLOSSAIRE : OUTILS DE TEST

---

## 🌐 TESTS D'INTÉGRATION (Supertest)
*Utilisés pour tester les endpoints de l'API et le cycle requête/réponse.*

### 🛠️ Requêtes
* `supertest(app)` : Crée un client HTTP de test.
* `.get('/route')` : Simule une requête **GET**.
* `.post('/route')` : Simule une requête **POST**.
* `.send({ ... })` : Envoie un corps de requête (**body**) JSON.
* `.set('Cookie', '...')` : Envoie des cookies dans les headers.

### 📥 Réponses & Assertions
* **`response.status`** : Le code HTTP (200, 401, 404...).
* **`response.body`** : Le JSON retourné par le controller.

> **Note sur les matchers :**
> * `toEqual()` : Vérifie l'égalité exacte (objet miroir).
> * `toMatchObject()` : Vérifie si l'objet contient au moins les clés précisées.

```javascript
// Vérifie le code HTTP
expect(response.status).toEqual(401);

// Propriétés du Body
expect(response.body).toHaveProperty('email'); // Existe ?
expect(response.body).toHaveProperty('email', 'john@test.com'); // Valeur précise ?

// Comparaison d'objets
expect(response.body).toEqual({ message: 'OK' }); // Strict
expect(response.body).toMatchObject({ id: 1 }); // Partiel
```
---

## 🧩 TESTS UNITAIRES (Vitest)

### 🎭 Mocking & Spies
* `vi.fn()` : Crée une fonction factice qui ne fait rien mais qu'on peut espionner.
* `vi.clearAllMocks()` : Remet les compteurs à zéro (appels, arguments) mais **ne supprime pas** le comportement défini par `mockImplementation`.

### ⚙️ Définir un comportement (Mocking)
* `vi.mocked(fn).mockResolvedValue(value)` : "Quand cette fonction **async** est appelée, retourne cette valeur".
* `vi.mocked(fn).mockReturnValue(value)` : "Quand cette fonction **sync** est appelée, retourne cette valeur".
* `vi.mocked(fn).mockReturnThis()` : "Retourne l'objet lui-même" — permet le chaînage type `res.status(200).json(...)`.
* `vi.mocked(fn).mockImplementation((args) => { ... })` : "Quand appelée, exécute cette fonction" (pour des comportements complexes).
* `vi.mocked(fn).mockImplementationOnce((args) => { ... })` : Idem, mais **seulement pour le prochain appel**.

### ✅ Assertions sur les fonctions (Expect)
* `expect(fn).toHaveBeenCalled()` : Vérifie que la fonction a été appelée au moins une fois.
* `expect(fn).toHaveBeenCalledWith(arg1, arg2)` : Vérifie que la fonction a été appelée avec ces arguments exacts.
* `expect(fn).toHaveBeenCalledTimes(2)` : Vérifie que la fonction a été appelée exactement 2 fois.
* `expect(fn).not.toHaveBeenCalled()` : Vérifie que la fonction n'a **pas** été appelée.

### 🔍 Matchers de valeurs
* `expect.objectContaining({ statusCode: 401 })` : Matcher partiel — vérifie qu'un objet contient **au moins** ces propriétés (utile pour vérifier ce que `next()` a reçu).
* `expect(value).toBe(200)` : Égalité stricte (`===`) — pour les primitives (nombres, strings, booleans).
* `expect(value).toEqual({ id: 1 })` : Égalité profonde — pour les objets et tableaux.