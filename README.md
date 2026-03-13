# Zombieland

## installation , initialization avec les commandes

Étape 1 — Créer la structure
```bash
Étape 1 — Créer la structure
bashmkdir zombieland
cd zombieland
pnpm init
mkdir client server

```

Étape 2 — Frontend (dans /client)
```bash
cd client
pnpm create vite . --template react-ts
pnpm install
pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion
pnpm add react-router-dom
# pnpm add axios
pnpm add zod

```

Vite + React + TypeScript : le socle frontend
Chakra UI + ses dépendances (emotion, framer-motion) : composants visuels
React Router DOM : navigation entre les pages
Axios : appels API vers le backend
Zod : validation des formulaires côté front

Étape 3 — Backend (dans /server)
```bash

cd ../server
pnpm init
pnpm add express cors dotenv
pnpm add jsonwebtoken argon2
pnpm add zod
pnpm add prisma @prisma/client
pnpm add -D typescript ts-node nodemon
pnpm add -D @types/node @types/express @types/cors @types/jsonwebtoken
```
Ce que ça installe :

Express : serveur API REST
CORS : autorise les requêtes du frontend
dotenv : variables d'environnement (.env)
JWT : authentification par token
Argon2 : hachage des mots de passe
Zod : validation des données côté API
Prisma + @prisma/client : ORM pour PostgreSQL
TypeScript, ts-node, nodemon : outils de dev
@types/* : typages TypeScript pour les dépendances

Étape 4 — Initialiser Prisma (dans /server)

```bash

npx prisma init

``` 

npx tsc --init

npm install --save-dev @commitlint/config-conventional @commitlint/cli husky