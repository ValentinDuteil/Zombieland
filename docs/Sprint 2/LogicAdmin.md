# 🧟 ZombieLand — Backlog Admin (Sprint 2)

---

## 📋 Liste complète — Partie Admin à implémenter

### Backend

| # | Route | Détail |
|---|---|---|
| A1 | `GET /api/users` | Liste tous les membres (admin) |
| A2 | `GET /api/users/:id/profile` | Détail d'un membre (déjà fait) |
| A3 | `PATCH /api/users/:id/profile` | Modifier infos + rôle d'un membre (admin) |
| A4 | `DELETE /api/users/:id` | Supprimer un membre (déjà fait) |
| A5 | `POST /api/attractions` | Créer une attraction |
| A6 | `PATCH /api/attractions/:id` | Modifier une attraction |
| A7 | `DELETE /api/attractions/:id` | Supprimer une attraction |
| A8 | `GET /api/reservations` | Liste toutes les réservations (déjà fait) |
| A9 | `PATCH /api/reservations/:id` | Modifier/confirmer/annuler une réservation |
| A10 | `POST /api/reservations` pour admin | Créer une réservation pour un membre |

---

### Frontend — Pages

| # | Page | Détail |
|---|---|---|
| P1 | `/admin` | Dashboard : stats (nb réservations, membres, attractions, revenu total) + tableau dernières réservations |
| P2 | `/admin/attractions` | Liste attractions + filtre + bouton modifier/supprimer |
| P3 | `/admin/attractions/:id/edit` | Formulaire modification attraction (tous les champs en input) |
| P4 | `/admin/members` | Liste membres + filtre |
| P5 | `/admin/members/:id` | Détail membre : infos + rôle modifiable + liste réservations + actions |
| P6 | `/admin/reservations` | Liste réservations + filtre + lien vers fiche membre |

---

### Frontend — Composants partagés

| # | Composant | Détail |
|---|---|---|
| C1 | `AdminLayout` | Sidebar avec menu (Dashboard, Attractions, Membres, Réservations) + protection route ADMIN |
| C2 | `StatCard` | Carte chiffre clé (réservations, membres, attractions, revenu) |
| C3 | `AdminTable` | Tableau générique réutilisable avec pagination |


## 📌 Point d'attention

> `AdminLayout` avec protection route ADMIN est la pièce centrale — tout le reste en dépend. À implémenter en premier.