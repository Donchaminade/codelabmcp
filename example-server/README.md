# Serveur MCP — météo de Lomé

Serveur d'exemple du codelab **« Crée ton propre serveur MCP et branche-le à Cursor »**, animé par Chaminade Adjolou (Donchaminade).

Il expose deux outils en **stdio** :

- `meteo_lome` — température, pluie et vent actuels à Lomé
- `risque_pluie` — lecture simple des précipitations prévues pour le lendemain

Les chiffres viennent de l'API gratuite [Open-Meteo](https://open-meteo.com/en/docs), sans clé. Coordonnées utilisées : latitude `6.1319`, longitude `1.2228`, fuseau `Africa/Lome`.

```
GET https://api.open-meteo.com/v1/forecast
    ?latitude=6.1319
    &longitude=1.2228
    &current=temperature_2m,precipitation,wind_speed_10m
    &hourly=precipitation
    &timezone=Africa/Lome
    &forecast_days=2
```

Le paquet installé est `@modelcontextprotocol/sdk` **1.32.1** (`McpServer`, `registerTool`, `StdioServerTransport`). Ce n'est pas le paquet v2 `@modelcontextprotocol/server`.

## Prérequis

- Node.js 20 ou plus (testé avec **v22.14.0**)
- npm (testé avec **10.9.9**)
- Un terminal

```bash
node -v
npm -v
```

## Créer le projet

Commandes réellement exécutées, dans cet ordre, depuis la racine du dépôt :

```bash
mkdir example-server
cd example-server
npm init -y
npm i @modelcontextprotocol/sdk zod
npm i -D typescript @types/node tsx
```

Versions résolues le 19 octobre 2026 :

| Paquet | Version |
| --- | --- |
| `@modelcontextprotocol/sdk` | 1.32.1 |
| `zod` | 4.6.7 |
| `typescript` | 7.0.2 |
| `@types/node` | 26.6.5 |
| `tsx` | 4.23.15 |

`npm init -y` écrit un `package.json` minimal. On le complète ensuite : `"type": "module"`, scripts `build`, `start`, `dev` et `test`, **sans retirer** `dependencies` ni `devDependencies`. Le fichier du dépôt est cet état final.

Premier `npm i` : `added 95 packages`, `found 0 vulnerabilities`.  
Second `npm i -D` : `added 7 packages`, `found 0 vulnerabilities`.

## Arborescence

```
example-server/
├── .cursor/
│   └── mcp.json
├── scripts/
│   └── appel-outils.ts
├── src/
│   └── index.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

`scripts/appel-outils.ts` est le client de test du dépôt. Le workshop peut s'arrêter à `src/index.ts`.

## Lancer

```bash
npm run build
npm start
```

`npm run build` lance `tsc` et, le 19 octobre 2026, se termine sans erreur :

```text
> meteo-lome-mcp@1.0.0 build
> tsc
```

`npm start` lance `node build/index.js`. Tant que l'entrée standard reste ouverte, le processus attend. La sortie standard reste vide. Sur l'erreur standard :

```text
Serveur MCP « météo Lomé » prêt (stdio).
```

Vérifié en gardant stdin ouvert : le processus est encore vivant après 2 secondes (interrompu par `timeout`, code 124), stdout vide, stderr égal à cette ligne.

`npm run dev` lance la même source avec `tsx`, sans recompiler.

Ne pas utiliser `console.log` dans `src/index.ts` : stdout est le canal JSON-RPC. Les messages passent par `console.error`.

## Test réel — client du dépôt

```bash
npm test
```

`npm test` exécute `tsx scripts/appel-outils.ts`. Le script démarre `node build/index.js`, liste les outils, appelle Open-Meteo, puis envoie un seuil refusé par Zod.

Sortie du 19 octobre 2026, vers 09:30 UTC (les chiffres météo changent d'une heure à l'autre) :

```text
=== tools/list ===
- meteo_lome : Météo actuelle à Lomé (Togo) : température, précipitations et vent. Source gratuite Open-Meteo, sans clé API.
- risque_pluie : Estime le risque de forte pluie demain à Lomé à partir des précipitations horaires prévues par Open-Meteo.

=== tools/call meteo_lome ===
{
  "content": [
    {
      "type": "text",
      "text": "Météo actuelle à Lomé (Togo)\nHeure locale : 2026-10-19T09:30\nTempérature : 31,4 °C\nPrécipitations : 0 mm\nVent : 9,2 km/h\nSource : Open-Meteo (aucune clé API)."
    }
  ]
}

=== tools/call risque_pluie { seuil_mm: 5 } ===
{
  "content": [
    {
      "type": "text",
      "text": "Risque de pluie à Lomé — demain (2026-10-20)\nSeuil retenu : 5 mm/h\nMaximum horaire prévu : 0,3 mm\nCumul sur la journée : 1,2 mm\nLecture : pluie légère possible, sous le seuil de forte pluie."
    }
  ]
}

=== tools/call risque_pluie {} ===
{
  "content": [
    {
      "type": "text",
      "text": "Risque de pluie à Lomé — demain (2026-10-20)\nSeuil retenu : 5 mm/h\nMaximum horaire prévu : 0,3 mm\nCumul sur la journée : 1,2 mm\nLecture : pluie légère possible, sous le seuil de forte pluie."
    }
  ]
}

=== tools/call risque_pluie { seuil_mm: -3 } ===
{
  "content": [
    {
      "type": "text",
      "text": "MCP error -32602: Input validation error: Invalid arguments for tool risque_pluie: Too small: expected number to be >=0 at seuil_mm"
    }
  ],
  "isError": true
}

=== stderr du serveur ===
Serveur MCP « météo Lomé » prêt (stdio).
```

## Test réel — MCP Inspector 2.11.0

`npx @modelcontextprotocol/inspector` sans version a installé ici la **v1.0.2**, dépréciée. La version actuelle consultée sur npm est la **2.11.0**. Commandes exécutées :

```bash
npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/list

npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/call --tool-name meteo_lome

npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/call --tool-name risque_pluie --tool-arg seuil_mm=5

npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/call --tool-name risque_pluie --tool-arg seuil_mm=-3
```

Sur Node v22.14.0, l'Inspector 2.11 affiche un avertissement `EBADENGINE` (il déclare Node `>= 22.19.0`). Les appels ont quand même abouti.

Résultats (le stderr du serveur s'affiche au-dessus du JSON) :

`tools/list` — code de sortie 0. Deux outils, `meteo_lome` et `risque_pluie`. Le schéma de `seuil_mm` est un nombre entre 0 et 100.

`tools/call meteo_lome` — code 0 :

```text
Météo actuelle à Lomé (Togo)
Heure locale : 2026-10-19T09:30
Température : 31,4 °C
Précipitations : 0 mm
Vent : 9,2 km/h
Source : Open-Meteo (aucune clé API).
```

`tools/call risque_pluie --tool-arg seuil_mm=5` — code 0 :

```text
Risque de pluie à Lomé — demain (2026-10-20)
Seuil retenu : 5 mm/h
Maximum horaire prévu : 0,3 mm
Cumul sur la journée : 1,2 mm
Lecture : pluie légère possible, sous le seuil de forte pluie.
```

`tools/call risque_pluie --tool-arg seuil_mm=-3` — code **5**, `isError: true` :

```text
MCP error -32602: Input validation error: Invalid arguments for tool risque_pluie: Too small: expected number to be >=0 at seuil_mm
```

Le handler n'est pas appelé : Zod refuse le nombre avant.

## Brancher Cursor

Le fichier testé est `.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "meteo-lome": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/build/index.js"]
    }
  }
}
```

`type` vaut `stdio` : la documentation Cursor le marque obligatoire pour un serveur local. `${workspaceFolder}` est la racine du projet qui contient `.cursor/mcp.json`. Il faut donc ouvrir le dossier `example-server` (ou copier ce fichier dans le projet où se trouve `build/index.js`).

Compiler avant d'activer (`npm run build`), puis dans Cursor : Customize → MCP, activer `meteo-lome`. L'agent demande une approbation avant l'appel.

Prompts d'essai :

- « Quel temps fait-il à Lomé ? »
- « Y a-t-il un risque de forte pluie demain ? »

Variante sans compilation, non utilisée pendant le test ci-dessus :

```json
{
  "mcpServers": {
    "meteo-lome": {
      "type": "stdio",
      "command": "npx",
      "args": ["tsx", "src/index.ts"]
    }
  }
}
```
