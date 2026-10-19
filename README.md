# Codelab MCP — Lomé

Site de présentation pour un workshop d'environ deux heures : **« Crée ton propre serveur MCP et branche-le à Cursor »**.

Animé par Chaminade Adjolou (Donchaminade), pour une communauté tech de Lomé, débutants inclus.

Le site est une suite de slides plein écran. Le serveur montré dans les slides est le dossier [`example-server/`](example-server/). Les blocs de code lisent ces fichiers : ils ne sont pas recopiés à la main.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre l'adresse affichée par Vite (par défaut `http://localhost:5173`). Le serveur de dev écoute sur `0.0.0.0`.

Raccourcis : flèches, Espace, glisser sur mobile, `S` sommaire, `T` thème, `F` plein écran. Le numéro de slide est dans le hash (`#12`).

```bash
npm run build
npm run preview
```

`npm run build` produit `dist/`.

## Le serveur d'exemple

```bash
cd example-server
npm install
npm run build
npm test
```

Le README de ce dossier contient les commandes, les versions, et la sortie réelle du 19 octobre 2026 (Open-Meteo, Inspector 2.11.0, validation Zod).

## Déployer sur Vercel

Le dépôt est un site statique Vite. `vercel.json` fixe le framework, la commande `npm run build` et le dossier `dist`.

1. Pousse le dépôt sur GitHub.
2. Dans Vercel, importe le projet. Le répertoire racine est la racine du dépôt, pas `example-server`.
3. Aucune variable d'environnement n'est nécessaire.
4. Déploie. Le hash des slides suffit : pas de réécriture d'URL.

Ce dépôt n'a pas été déployé publiquement par l'atelier de construction.
