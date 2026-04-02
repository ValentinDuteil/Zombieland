# Plan de Tests — ZombieLand

## Stack de test
- **Framework** : Vitest
- **Tests HTTP** : Supertest
- **CI/CD** : GitHub Actions (déclenché sur push/PR vers `dev` et `main`)

---

## 1. Tests Unitaires ✅

> Testent chaque controller isolément avec des mocks Prisma et argon2.
> Aucune base de données réelle n'est utilisée.

### auth.controller — Valentin
- [x] `login` — email inexistant → 401
- [x] `login` — mot de passe incorrect → 401
- [x] `login` — connexion réussie → 200
- [x] `login` — body invalide → 400
- [x] `register` — email déjà existant → 409
- [x] `register` — inscription réussie → 201
- [x] `register` — body invalide → 400
- [x] `logout` — déconnexion réussie → 200
- [x] `me` — utilisateur non connecté → 401
- [x] `me` — utilisateur connecté → 200
- [x] `me` — utilisateur inexistant en BDD → 404

### attractions.controller — Valentin
- [x] `getAttractions` — retourne liste → 200
- [x] `getAttractionById` — id invalide → 400
- [x] `getAttractionById` — attraction inexistante → 404
- [x] `getAttractionById` — attraction retournée → 200
- [x] `createAttraction` — mot de passe incorrect → 401
- [x] `createAttraction` — création réussie → 201
- [x] `deleteAttraction` — attraction inexistante → 404
- [x] `deleteAttraction` — suppression réussie → 204
- [x] `updateAttraction` — attraction inexistante → 404
- [x] `updateAttraction` — mise à jour réussie → 200

### setting.controller — Valentin
- [x] `getMaxTickets` — paramètre inexistant → 404
- [x] `getMaxTickets` — valeur retournée → 200
- [x] `updateMaxTickets` — admin inexistant → 404
- [x] `updateMaxTickets` — mot de passe incorrect → 401
- [x] `updateMaxTickets` — mise à jour réussie → 200

### users.controller — Peter
- [x] `getAllUsers` — retourne liste → 200
- [x] `getAllUsers` — erreur Prisma → throw
- [x] `getProfile` — admin accède à n'importe quel profil → 200
- [x] `getProfile` — membre accède à un autre profil → 403
- [x] `getProfile` — id invalide → 400
- [x] `getProfile` — utilisateur inexistant → 404
- [x] `getProfile` — erreur Prisma → throw
- [x] `updateProfile` — admin met à jour → 200
- [x] `updateProfile` — membre tente de modifier un autre profil → 403
- [x] `updateProfile` — id invalide → 400
- [x] `updateProfile` — validation Zod échoue → 400
- [x] `updateProfile` — mot de passe incorrect → 401
- [x] `updateProfile` — erreur Prisma → throw

### reservations.controller — Yohann
- [x] `createReservation` — date invalide → 400
- [x] `createReservation` — ticket inexistant → 404
- [x] `createReservation` — parc complet → 409
- [x] `createReservation` — réservation créée → 201
- [x] `deleteReservation` — mot de passe incorrect → 401
- [x] `deleteReservation` — règle J-10 → 400
- [x] `deleteReservation` — annulation réussie → 200

### ticket.controller — Daphné
- [x] `getAllPrices` — ticket inexistant → 404
- [x] `getAllPrices` — prix retourné → 200
- [x] `updateTicketPrice` — non authentifié → 401
- [x] `updateTicketPrice` — non admin → 403
- [x] `updateTicketPrice` — admin inexistant → 404
- [x] `updateTicketPrice` — mot de passe incorrect → 401
- [x] `updateTicketPrice` — mise à jour réussie → 200

---

## 2. Tests d'Intégration ✅

> Testent les routes HTTP complètes (middleware → controller → réponse)
> via Supertest avec mocks Prisma.

### /api/auth — Valentin
- [x] `GET /me` — non authentifié → 401
- [x] `GET /me` — authentifié → 200
- [x] `POST /register` — email existant → 409
- [x] `POST /register` — body invalide → 400
- [x] `POST /register` — inscription réussie → 201
- [x] `POST /login` — email inexistant → 401
- [x] `POST /login` — mot de passe incorrect → 401
- [x] `POST /login` — body invalide → 400
- [x] `POST /login` — connexion réussie → 200
- [x] `POST /logout` — déconnexion réussie → 200

### /api/attractions — Valentin
- [x] `GET /` — liste retournée → 200
- [x] `GET /:id` — id invalide → 400
- [x] `GET /:id` — attraction inexistante → 404
- [x] `GET /:id` — attraction retournée → 200
- [x] `POST /` — mot de passe incorrect → 401
- [x] `POST /` — création réussie → 201
- [x] `DELETE /:id` — attraction inexistante → 404
- [x] `DELETE /:id` — suppression réussie → 204
- [x] `PATCH /:id` — attraction inexistante → 404
- [x] `PATCH /:id` — mise à jour réussie → 200

### /api/settings — Valentin
- [x] `GET /` — paramètre inexistant → 404
- [x] `GET /` — valeur retournée → 200
- [x] `PATCH /` — non authentifié → 401
- [x] `PATCH /` — mot de passe incorrect → 401
- [x] `PATCH /` — mise à jour réussie → 200

### /api/users — Peter
- [x] `GET /` — liste retournée → 200

### /api/reservations — Yohann
- [x] `POST /` — ticket inexistant → 404
- [x] `POST /` — non authentifié → 401
- [x] `POST /` — utilisateur inexistant (flux admin) → 404
- [x] `POST /` — date invalide → 400
- [x] `POST /` — création réussie → 201
- [x] `POST /` — capacité dépassée → 409
- [x] `DELETE /:id` — annulation réussie → 200
- [x] `DELETE /:id` — non authentifié → 401

### /api/tickets — Daphné
- [x] `GET /` — prix retourné → 200
- [x] `GET /` — ticket inexistant → 404
- [x] `PATCH /price` — mise à jour réussie → 200
- [x] `PATCH /price` — non authentifié → 401
- [x] `PATCH /price` — non admin → 403
- [x] `PATCH /price` — admin inexistant → 404
- [x] `PATCH /price` — mot de passe incorrect → 401

---

## 3. Tests Fonctionnels ✅

> Testent des scénarios utilisateur complets via Supertest.
> Chaque scénario simule un cas d'usage métier réel.

### Scénario Admin — Yohann
- [x] Admin authentifié modifie le prix d'un ticket
- [x] Admin authentifié crée une nouvelle attraction
- [x] Admin authentifié supprime une attraction

### Scénario Membre — Daphné
- [x] Membre consulte son profil
- [x] Membre réserve avec des données valides
- [x] Membre tente de réserver un parc complet → rejeté
- [x] Utilisateur non connecté tente d'accéder → 401

---

## 4. Tests de Sécurité ✅

> Couverts dans les tests unitaires et d'intégration.

- [x] Vérification JWT sur toutes les routes protégées
- [x] Vérification du rôle ADMIN sur les routes sensibles
- [x] Vérification mot de passe admin avant toute action critique
- [x] Validation Zod des inputs sur toutes les routes
- [x] Règle J-10 pour l'annulation de réservation
- [x] Isolation des données (un membre ne peut pas accéder aux données d'un autre)

---

## 5. CI/CD ✅

- [x] GitHub Actions configuré sur les branches `dev` et `main`
- [x] Déclenchement automatique sur chaque push et pull request
- [x] Pipeline : checkout → Node.js 20 → pnpm → install → test
- [x] PR bloquée si les tests échouent

---

## 6. Tests Non Implémentés

> Non requis pour le RNCP CDA.

- [ ] Tests E2E navigateur (Playwright / Cypress)
- [ ] Tests unitaires composants React (React Testing Library)
- [ ] Tests de performance (k6 / Artillery)
- [ ] Tests de charge