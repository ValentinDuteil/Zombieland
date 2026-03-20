# 🧟 ZombieLand — Backlog complet (mis à jour)

---

## 🔴 1. Bugs bloquants — à corriger tout de suite

| # | Fichier | Problème |
|---|---|---|
| B1 | `reservations.controller.ts` | `id_USER: req.user?.id ?? 1` — faille sécu, réservation créée pour user id=1 si req.user undefined |
| B2 | `Attractions.tsx` | Filtre cassé — compare `a.intensity` (`"LOW"/"MEDIUM"/"HIGH"`) avec `"Peur Acceptable"` etc. Ne matche jamais |
| B3 | `MyReservations.tsx` | `alert(data.error)` — le back renvoie `{ message }` pas `{ error }`, l'alert est toujours `undefined` |
| B4 | `Register.tsx` | Labels Nom/Prénom inversés — `firstname` bindé sur "Nom", `lastname` sur "Prénom" |
| B5 | `AttractionDetailPage.tsx` | axios + import incohérent — seule page avec axios, tout le reste utilise fetch natif |
| B6 | `seed.ts` | Mots de passe en clair (`'hashedpassword123'`) — seed inutilisable pour tests réalistes |
| B7 | `auth.controller.ts` | Réponse register mal structurée — renvoie `{ userWithoutPassword: {...} }` au lieu de `{ id, email... }` |

---

## 🟠 2. Fonctionnalités manquantes pour verrouiller le MVP

| # | Où | Quoi |
|---|---|---|
| M1 | Front + Back | Cookie `secure: true` + `sameSite: 'none'` à valider en production sur Render |
| M2 | Header | Lien "Réserver" visible uniquement pour les membres connectés |
| M3 | `MyReservations.tsx` | Message de confirmation après annulation (pas juste disparition silencieuse de la carte) |
| M4 | `Reservation.tsx` | Checkbox mentions légales + récapitulatif billets/date avant validation |
| M5 | Routes | Middleware `validate` à brancher sur `auth.routes.ts` et `reservations.routes.ts` pour renvoyer les détails Zod champ par champ au front |
| M6 | `MyAccount.tsx` | CSS manquant — page sans style |
| M7 | `MyAccount.tsx` | Bouton "Supprimer mon profil" sans confirmation — DELETE déclenché directement |
| M8 | `users.controller.ts` | Vérifier que `req.params.id === req.user.id` ou retirer le param de la route — incohérence actuelle |

---

## 🟡 3. Dette technique — à traiter

| # | Où | Quoi |
|---|---|---|
| D1 | `users.controller.ts` | Vérification mot de passe actuel avant modification (champ `currentPassword` + `argon2.verify`) |
| D2 | `AttractionDetailPage.tsx` | Badges catégories tous en `position="absolute"` aux mêmes coordonnées → superposés |
| D3 | `Attractions.tsx` | `catch` silencieux — pas de message d'erreur affiché si le back est down |
| D4 | `attraction.controller.ts` | Renommer `getAttraction` → `getAttractions` et `getFindAttraction` → `getAttractionById` |
| D5 | Back | Couche service à extraire des controllers (`findByEmail`, `createUser`…) pour séparer logique métier |
| D6 | Back | Filtre `GET /api/reservations?upcoming=true` pour réservations à venir |
| D7 | CSS | Pages restantes sans style : homepage, plan, contact, détail attraction, background page attractions |

---

## 🟢 4. Sprint 2 — Peut attendre

| # | Où | Quoi |
|---|---|---|
| S1 | Front | Page d'accueil `/` |
| S2 | Front + Back | Dashboard admin complet (gestion attractions, réservations, membres, catégories, prix) |
| S3 | Front | Pop-up login en overlay au lieu de redirection |
| S4 | Front | Pop-up confirmation modification profil avec saisie mot de passe actuel |
| S5 | Front | Refacto Axios → fetch natif partout |
| S6 | Back | `GET /api/availabilities` |
| S7 | Back | Routes admin attractions : `POST /`, `PATCH /:id`, `DELETE /:id` |
| S8 | Back | `PATCH /api/reservations/:id` (admin) |
| S9 | Back | `GET /api/users` (admin) |
| S10 | BDD | Photo de profil : colonne + gestion upload |