# 📑 Fiche Technique : Gestion Dynamique des Médias (Images)

## 1. Architecture du Stockage
Dans une application fullstack professionnelle (React / Node / PostgreSQL), on sépare le **contenu** (les pixels) du **contenant** (la base de données) pour des raisons de performance.

### A. Le Fichier Physique (Le "Blob")
* **Lieu :** Stocké sur le système de fichiers (File System) du serveur API.
* **Dossier type :** `/public/uploads/` ou `/assets/attractions/`.
* **Action :** Lors de l'upload via le formulaire Admin, le serveur reçoit le flux binaire, le renomme avec un `timestamp` (ex: `17123456-fosse.webp`) pour éviter les conflits de noms, et l'écrit sur son disque.

### B. La Référence en Base de Données (Le "Chemin")
* **Lieu :** Table `attraction`, colonne `image` (Type : `VARCHAR`).
* **Valeur stockée :** Un chemin relatif (ex: `/uploads/17123456-fosse.webp`).
* **Raison :** On ne stocke pas l'image "en binaire" dans SQL (type BYTEA) car cela ferait exploser la taille de la BDD, ralentirait les sauvegardes et saturerait la RAM du serveur lors des requêtes.

---

## 2. Flux de Données (Workflow)

### ⬆️ Phase d'Upload (Écriture)
1. **Front-end (React) :** L'utilisateur sélectionne un fichier. Le code utilise `FormData` pour encapsuler le fichier binaire.
2. **Serveur (Node/Express) :** - Utilise un middleware (ex: `Multer`) pour intercepter le fichier.
   - Enregistre le fichier physiquement dans le dossier `/uploads`.
3. **BDD (PostgreSQL) :** Exécute une requête `PATCH` ou `UPDATE` pour enregistrer la chaîne de caractères (le chemin) dans la colonne `image`.

### ⬇️ Phase d'Affichage (Lecture)
1. **Client :** Effectue un `GET` sur l'API pour récupérer les données de l'attraction.
2. **Réponse API :** Renvoie un JSON : `{"name": "Fosse", "image": "/uploads/17123456-fosse.webp"}`.
3. **Composant React :** Reconstruit l'URL complète pour la balise `<Image />` :
   - `src = {API_URL + attraction.image}`
   - Rendu final : `<img src="http://localhost:3000/uploads/17123456-fosse.webp" />`

---

## 3. Argumentaire pour le Jury (Oral CDA)

- **Scalabilité :** Cette méthode permet de déporter plus tard les images sur un service de stockage externe (type AWS S3 ou Cloudinary) sans modifier la structure de la base de données.
- **Dynamisme :** Contrairement aux images situées dans le dossier `/assets` du Front-end (qui nécessitent un