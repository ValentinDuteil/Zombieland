## 🔄 Discussion technique — Axios vs Fetch natif

### Contexte
AttractionDetailPage.tsx utilise axios alors que tout le reste du projet utilise fetch natif.
Choix à faire avant sprint 3.

### Option 1 — Garder fetch natif partout (recommandé par Cloclo)
- Zéro refacto supplémentaire
- Cohérence immédiate dans tout le codebase
- Pas de dépendance externe supplémentaire
- Fetch est natif au navigateur, pas besoin d'installer quoi que ce soit
- **Action** : refacto AttractionDetailPage.tsx → fetch natif (30min)

### Option 2 — Migrer tout vers axios
**Avantages :**
- Syntaxe plus concise (pas de .json() manuel)
- Gestion d'erreurs automatique sur les 4xx/5xx
- Possibilité d'intercepteurs pour les headers communs

**Ce que ça implique :**
- Refacto de toutes les pages : Login, Register, Reservation, MyAccount, 
  MyReservations, Attractions, Header → estimation 2-3h minimum
- Risque de régression sur chaque page modifiée
- À planifier en Sprint 3 uniquement si l'équipe est unanime

### Option 3 — Laisser coexister les deux
❌ À éviter — incohérence totale, mauvaise pratique

___

## 🧪 Proposition — Mise en place des tests (Sprint 3)

### Contexte
Le projet n'a pas encore de tests automatisés. 
Sans tests, chaque refacto (comme axios vs fetch) est un risque de régression non détecté.

### Stack proposée
- **Vitest** → tests unitaires front (compatible Vite, même config)
- **Jest + Supertest** → tests unitaires et d'intégration back (routes HTTP)

### Ce qu'on testerait en priorité
**Back :**
- Middlewares : checkToken, checkRole, validate
- Controllers : auth (register, login), users (updateProfile), reservations
- AppError : vérifier que les bonnes erreurs sont throwées

**Front :**
- Composants critiques : ConfirmModal, LoginModal
- Logique métier : handleSubmit, handleUpdate, handleDelete

### Ce que ça apporte
- Détection immédiate des régressions lors des refactos
- Documentation vivante du comportement attendu
- Sécurité pour le Sprint 3 si scaling (paiement Stripe, notation, commentaires)

### Estimation
- Setup Vitest + Jest : 2h
- Tests prioritaires back : 1 jour
- Tests prioritaires front : 1 jour


### Décision à prendre en review Sprint 2