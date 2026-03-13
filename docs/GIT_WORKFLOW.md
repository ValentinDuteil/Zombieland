# 🧟 ZombieLand — Git Workflow

## Stratégie des branches

```
main  ← production, code stable et validé
  └── dev  ← intégration, toutes les features mergées ici
        └── feat/ma-feature  ← développement individuel
```

> ⚠️ On ne travaille **jamais** directement sur `main` ou `dev`.
> Toute PR individuelle cible **`dev`**, jamais `main`.
> `main` est mis à jour uniquement depuis `dev` après validation complète.

---

## 1. Avant de commencer à travailler

Toujours partir d'un `dev` à jour :

```bash
git checkout dev
git pull origin dev
```

Puis créer sa branche :

```bash
git checkout -b type/nom-de-la-tache
```

**Convention de nommage des branches :**

| Type | Usage | Exemple |
|---|---|---|
| `feat/` | Nouvelle fonctionnalité | `feat/page-reservation` |
| `fix/` | Correction de bug | `fix/formulaire-login` |
| `chore/` | Tâche technique | `chore/husky-setup` |
| `docs/` | Documentation | `docs/readme` |
| `style/` | CSS / mise en forme | `style/navbar` |
| `refactor/` | Refactorisation | `refactor/auth-service` |

---

## 2. Pendant le développement

Committer régulièrement avec des messages conventionnels :

```bash
git add .
git commit -m "type: description en lowercase"
```

**Types de commits autorisés :**

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Mise en forme |
| `refactor` | Refactorisation |
| `test` | Ajout / modif de tests |
| `chore` | Maintenance, config |

**Exemples valides :**
```bash
✅ git commit -m "feat: ajout de la page de réservation"
✅ git commit -m "fix: correction du formulaire de login"
✅ git commit -m "chore: mise à jour des dépendances"

❌ git commit -m "Update truc"
❌ git commit -m "Feat: Ajout page"   ← majuscule interdite
❌ git commit -m "wip"                ← type manquant
```

> ⚠️ Husky rejettera automatiquement les messages non conformes.

---

## 3. Pousser sa branche

```bash
git push origin type/nom-de-la-tache
```

GitHub affiche un lien directement dans le terminal → clique dessus pour créer la PR.

---

## 4. Créer la Pull Request → cible `dev`

**Via le lien dans le terminal** (le plus rapide) ou **via GitHub** :
1. Aller sur le repo → cliquer sur **"Compare & pull request"**
2. Vérifier que la PR cible bien **`dev`** et non `main` ⚠️
3. Remplir :
   - **Titre** → `type: description`
   - **Description** → ce qui a été fait + comment tester
   - **Reviewer** → assigner au moins 1 camarade
4. Cliquer **"Create pull request"**

**Template de description :**
```
## Ce que j'ai fait
- ...
- ...

## Comment tester
- ...
```

> ⚠️ On ne merge **jamais** sa propre PR — toujours attendre la validation d'un reviewer.

---

## 5. Après le merge

```bash
git checkout dev               # retour sur dev
git pull origin dev            # récupérer les changements
git branch -d type/nom-branche # supprimer la branche en local
```

Supprimer aussi la branche sur GitHub via le bouton **"Delete branch"** après le merge.

---

## 6. Mise en production (dev → main)

Uniquement quand une version est stable et validée par toute l'équipe :

1. Créer une PR de `dev` vers `main` sur GitHub
2. Tous les membres valident
3. Merger → c'est en production 🚀

---

## Résumé en un coup d'œil

```
1. git checkout dev && git pull origin dev
2. git checkout -b type/nom-de-la-tache
3. ... développement ...
4. git add . && git commit -m "type: description"
5. git push origin type/nom-de-la-tache
6. Créer la PR sur GitHub → cible DEV + assigner un reviewer
7. Après merge → git checkout dev && git pull && git branch -d ta-branche
```

---

## Commandes utiles

```bash
git branch -a                          # voir toutes les branches (local + remote)
git push origin --delete nom-branche   # supprimer une branche sur GitHub
git stash                              # mettre de côté des modifs non commitées
git stash pop                          # récupérer les modifs mises de côté
```