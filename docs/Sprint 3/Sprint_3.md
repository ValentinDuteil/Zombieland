🧟 ZombieLand — Sprint 3
Durée : 4 jours
Objectif : Sécurité renforcée (CSRF), validation des formulaires, migration BDD Neon et polish final

⚙️ Prérequis — Jour 1 (toute l'équipe)

- Merger et nettoyer toutes les branches du Sprint 2
- Migrer la BDD PostgreSQL de Render vers Neon
- Mettre à jour les .env de prod (DATABASE_URL → Neon)
- Vérifier que client ET serveur démarrent sur toutes les machines après migration

👤 Valentin — Product Owner
Backend

- Fix : Vérification du mot de passe lors de la suppression d'un compte membre par l'admin
- Fix : Désactiver l'auto-login après register si c'est l'admin qui crée le compte

Frontend

- B1 Brancher les erreurs Zod de Peter sur les pages front (affichage par champ)
- B2 Responsive : masquer la sidebar admin sur mobile dans `/admin/members/:id/reservations`
- CSS : polish général des pages admin

🧩 Peter — Scrum Master
Backend

- Z1 Schéma Zod `AttractionSchema` — validation des inputs création/modification attraction
- Z2 Branchement du middleware `validate` sur les routes POST/PATCH attractions
- Z3 Vérifier et harmoniser tous les schémas Zod existants (auth, reservation)

Frontend

- CSS : bugs responsives restants
- CSS : polish pages membres et réservations admin

⚙️ Yohann — Lead Dev + Git Master
Backend

- S1 Middleware CSRF : génération du token `XSRF-TOKEN` (cookie lisible par JS)
- S2 Middleware de vérification du token CSRF sur les routes sensibles (POST, PATCH, DELETE)

Frontend

- S3 Configuration Axios avec `xsrfCookieName` et `xsrfHeaderName`
- S4 Vérifier que toutes les pages utilisent bien l'instance Axios centralisée
- S5 AuthContext React : centraliser l'état de connexion pour éviter les re-fetch du He