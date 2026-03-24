🧟 ZombieLand — Sprint 2
Durée : 4 jours
Objectif : Dashboard admin complet, page d'accueil, UX améliorée et dette technique soldée

⚙️ Prérequis — Jour 1 (toute l'équipe)

À valider ensemble avant de commencer à coder les features.

- Merger et nettoyer toutes les branches du Sprint 1
- Vérifier que le déploiement Render fonctionne (cookie secure + sameSite: 'none')
- Mettre à jour les .env de prod (CLIENT_URL, JWT_SECRET)
- Relancer le seed avec les mots de passe hashés
- Vérifier que client ET serveur démarrent sur toutes les machines

👤 Valentin — Product Owner
Backend

- A1 `GET /api/users` Liste tous les membres (admin)
- A2 `GET /api/users/:id/profile` Détail d'un membre (déjà fait)
- A3 `PATCH /api/users/:id/profile` Modifier infos + rôle d'un membre (admin)
- A4 `DELETE /api/users/:id` Supprimer un membre (déjà fait)
- `GET /api/availabilities` → disponibilités du parc

Frontend

- Pop-up qui demande un mot de passe pour confirmer les changement d'informations sur My-Account
- Pop-up qui demande un mot de passe pour confirmer la suppression du compte
- Pop-up qui demande "veuillez vous connecter" si on souhaite faire une réservation
et que l'utilisateur n'est pas connecté
- Pop-up login en overlay
- P4 `/admin/members` Liste membres + filtre
- P5 `/admin/members/:id` Détail membre : infos + rôle modifiable + liste réservations + actions

🧩 Peter — Scrum Master
Backend

Frontend

- CSS : bugs généraux + page d'accueil
- C1 `AdminLayout` Sidebar avec menu (Dashboard, Attractions, Membres, Réservations) + protection route ADMIN
- C2 `StatCard` Carte chiffre clé (réservations, membres, attractions, revenu)
- C3 `AdminTable` Tableau générique réutilisable avec pagination

⚙️ Yohann — Lead Dev + Git Master
Backend

- Bug sur l'annulation de la réservation
- A8 `GET /api/reservations` Liste toutes les réservations (déjà fait)
- A9 `PATCH /api/reservations/:id` Modifier/confirmer/annuler une réservation
- A10 `POST /api/reservations` pour admin Créer une réservation pour un membre 

Frontend

- P1 `/admin` Dashboard : stats (nb réservations, membres, attractions, revenu total) + tableau dernières réservations
- P6 `/admin/reservations` Liste réservations + filtre + lien vers fiche membre
- a voir pour le sprint 3 : mettre un calendrier avec les réservations (ex : FullCalendar) différente couleur selon le nombre de reservations ce jour-là, rouge si complet, vert si dispo, etc.

🎨 Daphné — Lead Dev

Backend

- A5 `POST /api/attractions` → création attraction (admin) ✅
- A6 `DELETE /api/attractions/:id` → suppression attraction (admin) ✅
- A7 `PATCH /api/attractions/:id` → modification attraction (admin) ✅

Frontend

- CSS : Pages manquantes (contact + plan) ✅
- P2 `/admin/attractions` Liste attractions + filtre + bouton modifier/supprimer (en cours)
- P3 `/admin/attractions/:id/edit` Formulaire modification attraction (tous les champs en input)

Groupe Déploiement 👍

Vérifier pipeline CI/CD sur Render

## ✅ Définition of Done

> Le sprint est terminé quand TOUT ce qui suit fonctionne :

- [x] Page d'accueil affichée et responsive
- [] Dashboard admin accessible avec stats (réservations, membres, attractions, revenu)
- [] CRUD attractions fonctionnel en admin (créer, modifier, supprimer)
- [x] Liste membres accessible en admin + fiche membre modifiable
- [] Liste réservations accessible en admin + modification/annulation possible
- [x] Bug annulation réservation corrigé (Yohann)
- [x] Cookie validé en production (cross-domain Render)
- [x] Confirmation mot de passe avant modification profil
- [x] Suppression de compte avec modale de confirmation
- [x] Pop-up login en overlay fonctionnel
- [] GET /api/availabilities fonctionnel
- [] Tout le monde a touché front ET back ← important pour le RNCP

## 📌 Point d'attention
 
> `AdminLayout` avec protection route ADMIN est la pièce centrale — tout le reste en dépend. À implémenter en premier.