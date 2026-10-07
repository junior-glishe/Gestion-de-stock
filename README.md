# StockPro — Gestion de stock

Application full-stack de gestion de stock :

- **backend/** — NestJS 11 + Prisma 6 + MySQL (port `3000`, préfixe API `/api`)
- **frontend/** — React 19 + Vite 6 + Tailwind CSS 4 (port `5173`, proxy `/api` → `localhost:3000`)

## Prérequis

- Node.js 18+ et npm
- MySQL 8 lancé en local (port `3306`)

## 1. Base de données

Créer l'utilisateur et la base :

```sql
CREATE USER IF NOT EXISTS 'stockpro'@'localhost' IDENTIFIED BY 'stockpro';
GRANT ALL PRIVILEGES ON gestion_stock.* TO 'stockpro'@'localhost';
CREATE DATABASE IF NOT EXISTS gestion_stock;
FLUSH PRIVILEGES;
```

Charger le schéma + les données de démonstration :

```bash
mysql -h127.0.0.1 -uroot gestion_stock < Docs/Modelisation-bd/gestion_stock.sql
```

Puis, depuis `backend/`, régénérer le client Prisma et hasher les mots de passe de démo :

```bash
cd backend
npm run db:generate
npm run db:seed
```

> En cas de besoin, `npm run db:reset` recharges le dump et relance le seed
> (chemin du dump : `Docs/Modelisation-bd/gestion_stock.sql`).

## 2. Lancer le backend

```bash
cd backend
npm install
npm run dev
```

L'API est disponible sur `http://localhost:3000/api`.
Configuration dans `backend/.env` :

```
DATABASE_URL="mysql://stockpro:stockpro@127.0.0.1:3306/gestion_stock"
PORT=3000
```

## 3. Lancer le frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

Ouvrir `http://localhost:5173`. Le proxy Vite redirige `/api` vers le backend.

## Comptes de démonstration

Mot de passe commun : **`demo1234`**

| Rôle         | Espace          | Email                        |
| ------------ | --------------- | ---------------------------- |
| Gestionnaire | `/gestionnaire` | `gestionnaire@stockpro.local` |
| Superviseur  | `/superviseur`  | `superviseur@stockpro.local`  |
| Administrateur | `/admin`      | `admin@stockpro.local`        |

Pages utiles : `/superviseur/journal-audit` (journal d'audit, réservé au superviseur).

## Autres commandes

```bash
cd backend
npm run build        # compilation TypeScript → dist/
npm start            # exécution de dist/ (après build)
```

```bash
cd frontend
npm run build        # build de production → frontend/dist/
npm run preview      # prévisualisation du build
```
