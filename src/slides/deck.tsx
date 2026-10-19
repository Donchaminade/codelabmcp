import type { ReactNode } from "react";
import mcpJson from "../../example-server/.cursor/mcp.json?raw";
import packageJson from "../../example-server/package.json?raw";
import serverSource from "../../example-server/src/index.ts?raw";
import tsconfigJson from "../../example-server/tsconfig.json?raw";
import { Bullets, Compare, Note, Stack } from "../components/Blocks";
import { CodeBlock } from "../components/CodeBlock";
import { Diagram } from "../components/Diagram";
import { ToolCards } from "../components/ToolCards";
import {
  CMD_BUILD,
  CMD_CHECK,
  CMD_INIT,
  CMD_LIST,
  CMD_METEO,
  CMD_PLUIE,
  CMD_START,
  CMD_ZOD,
  MCP_TSX,
  OUT_BUILD,
  OUT_CHECK,
  OUT_INSTALL,
  OUT_LIST,
  OUT_METEO,
  OUT_PLUIE,
  OUT_START,
  OUT_ZOD,
  TREE,
  VERSIONS,
} from "./outputs";

export type Slide = {
  section: string;
  title: string;
  content: ReactNode;
};

function slide(section: string, title: string, content: ReactNode): Slide {
  return { section, title, content };
}

export const slides: Slide[] = [
  slide(
    "Ouverture",
    "Crée ton propre serveur MCP",
    <Stack>
      <p className="max-w-4xl text-[1.45rem] leading-snug md:text-[2rem]">
        Branche un outil réel à l'agent de Cursor. Aujourd'hui, il répond avec la météo de Lomé, pas avec une estimation.
      </p>
      <p className="text-[1.25rem] text-muted md:text-[1.5rem]">
        Communauté tech de Lomé · environ 2 heures · débutants inclus
      </p>
      <p className="font-display text-[1.35rem]">Chaminade Adjolou (Donchaminade)</p>
      <Note>
        Flèches ou Espace pour avancer. Glisser horizontalement sur mobile. S ouvre le sommaire, T le thème, F le plein écran. L'adresse se termine par # et le numéro de slide.
      </Note>
    </Stack>,
  ),
  slide(
    "Ouverture",
    "Deux heures, débutants inclus",
    <Stack>
      <Bullets
        items={[
          "D'abord l'idée : un modèle qui agit, le protocole MCP, Cursor, la sécurité.",
          "Ensuite la pratique : un serveur TypeScript, deux outils, un appel réel à Open-Meteo.",
          "On termine en branchant ce serveur dans Cursor et en parlant à l'agent.",
          "Tu repars avec un dossier qui compile, un fichier mcp.json, et de quoi l'étendre.",
        ]}
      />
      <Note>Aucune clé API. Rien à payer. Le serveur reste sur ta machine.</Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Répondre, ou agir",
    <Stack>
      <Compare
        left={{
          title: "Un modèle qui répond",
          points: [
            "Il produit du texte à partir de ce qu'il a appris.",
            "« Il fait beau à Lomé » peut être inventé.",
            "Il ne voit ni l'heure, ni ta base, ni ton dépôt.",
          ],
        }}
        right={{
          title: "Un modèle qui agit",
          points: [
            "Il peut appeler un outil, attendre le résultat, puis formuler la réponse.",
            "La température vient d'une API, à cette minute.",
            "L'outil décide ce qui est permis : ici, seulement lire la météo.",
          ],
        }}
      />
    </Stack>,
  ),
  slide(
    "Théorie",
    "Le Model Context Protocol",
    <Stack>
      <Bullets
        items={[
          "MCP est un standard ouvert annoncé par Anthropic fin 2024.",
          "Il décrit comment un modèle se branche à des outils, des ressources et des prompts.",
          "Le même serveur peut servir Cursor, un autre éditeur, ou un script.",
          "On n'invente pas un format par application : on parle JSON-RPC.",
        ]}
      />
      <p className="text-[1.25rem]">
        <a className="font-mono text-[18px] text-accent underline" href="https://modelcontextprotocol.io" target="_blank" rel="noreferrer">
          modelcontextprotocol.io
        </a>
      </p>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Trois façons de donner du contexte",
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        ["Tool", "Une action. Le modèle l'appelle avec des arguments. Exemple : meteo_lome."],
        ["Resource", "Une donnée en lecture, identifiée par une URI. Exemple : une note interne."],
        ["Prompt", "Un message type, pour poser toujours la même question de la même façon."],
      ].map(([title, text]) => (
        <article key={title} className="border border-line bg-surface p-5">
          <h3 className="font-display text-3xl text-accent">{title}</h3>
          <p className="mt-3 text-[1.25rem] leading-snug">{text}</p>
        </article>
      ))}
    </div>,
  ),
  slide(
    "Théorie",
    "Host, client, server",
    <div className="grid gap-3 md:grid-cols-3">
      {[
        ["Host", "L'application devant toi. Ici, Cursor : la conversation, l'agent, les réglages."],
        ["Client", "Le connecteur MCP à l'intérieur du host. Un client par serveur."],
        ["Server", "Notre programme. Il déclare des outils et répond quand on l'appelle."],
      ].map(([title, text]) => (
        <article key={title} className="border border-line border-l-4 border-l-accent bg-surface p-5">
          <h3 className="font-display text-3xl">{title}</h3>
          <p className="mt-3 text-[1.25rem] leading-snug">{text}</p>
        </article>
      ))}
    </div>,
  ),
  slide(
    "Théorie",
    "stdio ou HTTP streamable",
    <Compare
      left={{
        title: "stdio",
        points: [
          "Cursor lance notre processus.",
          "Les requêtes arrivent sur stdin, les réponses partent sur stdout.",
          "Parfait pour un atelier : rien n'écoute sur le réseau.",
          "C'est le transport de l'exercice.",
        ],
      }}
      right={{
        title: "HTTP streamable",
        points: [
          "Le serveur tourne à une URL.",
          "Plusieurs personnes peuvent s'y connecter.",
          "Il faut penser au réseau, à l'auth, aux secrets.",
          "On le garde pour le bonus, pas pour la première heure.",
        ],
      }}
    />,
  ),
  slide(
    "Théorie",
    "Comment Cursor s'en sert",
    <Bullets
      items={[
        "L'agent lit la liste des outils et en choisit un si la question s'y prête.",
        "Les serveurs se règlent dans Customize, section MCP.",
        "Chaque outil apparaît avec son nom et sa description.",
        "Par défaut, Cursor demande l'approbation avant l'appel : tu vois les arguments.",
        "Les logs sont dans le panneau Output, canal MCP Logs.",
      ]}
    />,
  ),
  slide(
    "Théorie",
    "Deux fichiers, un seul gagnant",
    <Stack>
      <Bullets
        items={[
          "Projet : .cursor/mcp.json, à côté du code. À partager avec l'équipe, sans secret.",
          "Global : ~/.cursor/mcp.json, pour les outils de toutes tes fenêtres.",
          "Si le même nom existe des deux côtés, le projet l'emporte.",
          "Cursor remplace ${workspaceFolder}, ${userHome} et ${env:NOM}.",
          "Pour stdio, la doc actuelle demande le champ type : \"stdio\", plus command et args.",
        ]}
      />
      <p>
        <a className="font-mono text-[18px] text-accent underline" href="https://cursor.com/docs/mcp" target="_blank" rel="noreferrer">
          cursor.com/docs/mcp
        </a>
      </p>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Pourquoi écrire le sien",
    <Bullets
      items={[
        "Le modèle ne connaît pas la météo de cette heure à Lomé.",
        "Tes règles tiennent en un fichier : lecture seule, seuil, message en français.",
        "Tu peux le lire en entier avant de l'activer. Un serveur téléchargé, beaucoup moins.",
        "Le workshop entier tient dans un dépôt, sans compte cloud.",
      ]}
    />,
  ),
  slide(
    "Théorie",
    "Des usages concrets, ici",
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {[
        ["Météo à Lomé", "L'exercice. Température, pluie, vent, via Open-Meteo."],
        ["Fortes pluies", "Un seuil sur les millimètres prévus. Utile en saison des pluies."],
        ["Base d'une startup", "Lire des commandes ou un stock. Écrire est un autre outil, plus tard."],
        ["Mobile Money", "Consulter un solde ou un reçu. Jamais envoyer d'argent depuis l'agent."],
        ["Docs internes", "Une resource : le modèle cite le document, il ne l'invente pas."],
        ["GitHub", "Issues, pull requests, CI. Le dépôt devient une source, pas un copier-coller."],
      ].map(([title, text]) => (
        <article key={title} className="border border-line bg-surface p-4">
          <h3 className="font-display text-2xl text-accent">{title}</h3>
          <p className="mt-2 text-[1.15rem] leading-snug">{text}</p>
        </article>
      ))}
    </div>,
  ),
  slide(
    "Théorie",
    "L'architecture de l'atelier",
    <Stack>
      <Diagram />
      <Note>
        Cursor lance le serveur en local. Le serveur appelle Open-Meteo en HTTPS sortant. Aucun port n'est ouvert chez toi.
      </Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Ce qu'il ne faut pas exposer",
    <Bullets
      items={[
        "stdout est le protocole. Un console.log casse la conversation. On logue avec console.error.",
        "Les secrets vivent dans l'environnement, jamais dans git ni dans le code.",
        "Un outil Mobile Money de cet atelier ne fait que lire.",
        "Ne renvoie pas de données personnelles « pour aider le modèle ».",
        "stdio reste sur ta machine. Une URL publique est un autre sujet, avec une auth.",
        "Lis le code d'un serveur reçu avant de l'activer.",
      ]}
    />,
  ),
  slide(
    "Outils",
    "Outils, librairies et API utilisés",
    <ToolCards
      cards={[
        {
          name: "Node.js",
          meta: `20+ · testé en ${VERSIONS.node}`,
          role: "Exécute le serveur, le build et l'Inspector.",
          links: [{ label: "nodejs.org", href: "https://nodejs.org/" }],
        },
        {
          name: "npm",
          meta: `livré avec Node · testé en ${VERSIONS.npm}`,
          role: "Installe le SDK, Zod, TypeScript et tsx.",
          links: [{ label: "npmjs.com", href: "https://www.npmjs.com/" }],
        },
        {
          name: "TypeScript",
          meta: VERSIONS.typescript,
          role: "Décrit le serveur et le compile vers build/index.js.",
          links: [{ label: "typescriptlang.org", href: "https://www.typescriptlang.org/" }],
        },
        {
          name: "tsx",
          meta: VERSIONS.tsx,
          role: "Lance src/index.ts sans recompiler, via npm run dev.",
          links: [{ label: "tsx.is", href: "https://tsx.is/" }],
        },
        {
          name: "Terminal",
          meta: "Cursor ou le système",
          role: "Sert à taper les commandes et à lire stderr.",
          links: [
            {
              label: "docs terminal VS Code",
              href: "https://code.visualstudio.com/docs/terminal/basics",
            },
          ],
        },
        {
          name: "Git et GitHub",
          meta: "optionnel",
          role: "Versionne le serveur et le partage avec le groupe.",
          links: [
            { label: "git-scm.com", href: "https://git-scm.com/" },
            { label: "github.com", href: "https://github.com/" },
          ],
        },
      ]}
    />,
  ),
  slide(
    "Outils",
    "Protocole, validation, données",
    <ToolCards
      cards={[
        {
          name: "@modelcontextprotocol/sdk",
          meta: VERSIONS.sdk,
          role: "Fournit McpServer, registerTool et StdioServerTransport.",
          detail: "Ligne 1.x. La v2 est un autre paquet : @modelcontextprotocol/server.",
          links: [
            {
              label: "npmjs.com/package/@modelcontextprotocol/sdk",
              href: "https://www.npmjs.com/package/@modelcontextprotocol/sdk",
            },
          ],
        },
        {
          name: "zod",
          meta: VERSIONS.zod,
          role: "Valide les arguments des outils et la réponse Open-Meteo.",
          links: [{ label: "zod.dev", href: "https://zod.dev/" }],
        },
        {
          name: "Open-Meteo",
          meta: "gratuit · sans clé",
          role: "Donne la météo actuelle et les précipitations prévues à Lomé.",
          detail: "GET https://api.open-meteo.com/v1/forecast",
          links: [{ label: "open-meteo.com/en/docs", href: "https://open-meteo.com/en/docs" }],
        },
        {
          name: "MCP Inspector",
          meta: VERSIONS.inspector,
          role: "Appelle les outils en ligne de commande, avant Cursor.",
          links: [
            {
              label: "github.com/modelcontextprotocol/inspector",
              href: "https://github.com/modelcontextprotocol/inspector",
            },
          ],
        },
        {
          name: "Cursor",
          meta: "Agent + réglages MCP",
          role: "Hôte : mcp.json, liste des outils, approbation des appels.",
          links: [{ label: "cursor.com/docs/mcp", href: "https://cursor.com/docs/mcp" }],
        },
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Vérifier la machine",
    <Stack>
      <Bullets
        items={[
          "Node.js 20 ou plus, npm, Cursor, un terminal.",
          "L'éditeur peut être Cursor lui-même.",
          `Sur la machine de ce dépôt : Node ${VERSIONS.node}, npm ${VERSIONS.npm}.`,
        ]}
      />
      <CodeBlock code={CMD_CHECK} filename="terminal" language="bash" />
      <CodeBlock code={OUT_CHECK} filename="sortie du 19 octobre 2026" language="text" />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Créer le projet",
    <Stack>
      <CodeBlock code={CMD_INIT} filename="terminal" language="bash" />
      <CodeBlock code={OUT_INSTALL} filename="versions résolues" language="text" />
      <Note>
        Les deux premières lignes sont la sortie npm. Les versions sont celles des paquets installés le 19 octobre 2026. npm init -y écrit un package.json minimal : on le complète ensuite, sans effacer dependencies.
      </Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "L'arborescence",
    <Stack>
      <CodeBlock code={TREE} filename="dossiers" language="text" />
      <Note>
        Le dépôt ajoute aussi scripts/appel-outils.ts et un README : ce sont les tests rejoués avec npm test.
      </Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "package.json",
    <Stack>
      <Note>Fichier du dépôt : example-server/package.json. type module, scripts build, start et dev.</Note>
      <CodeBlock code={packageJson} filename="package.json" language="json" />
    </Stack>,
  ),
  slide(
    "Pratique",
    "tsconfig.json",
    <CodeBlock code={tsconfigJson} filename="tsconfig.json" language="json" />,
  ),
  slide(
    "Pratique",
    "src/index.ts",
    <Stack>
      <Note>
        Fichier complet du dépôt. Lomé est fixée : 6.1319, 1.2228. Zod contrôle la réponse météo et le seuil de pluie.
      </Note>
      <CodeBlock code={serverSource} filename="src/index.ts" language="typescript" />
    </Stack>,
  ),
  slide(
    "Pratique",
    "stdout est le canal",
    <Stack>
      <Bullets
        items={[
          "En stdio, chaque octet de stdout doit être du JSON-RPC.",
          "console.log dans l'outil, et Cursor ne comprend plus la réponse.",
          "console.error va sur stderr : Cursor et l'Inspector peuvent l'afficher, le protocole reste intact.",
          "Le serveur écrit une seule ligne au démarrage, sur stderr.",
        ]}
      />
      <CodeBlock code={OUT_START} filename="stderr" language="text" />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Compiler, puis démarrer",
    <Stack>
      <CodeBlock code={`${CMD_BUILD}\n\n${OUT_BUILD}`} filename="terminal" language="text" />
      <CodeBlock code={CMD_START} filename="terminal" language="bash" />
      <Note>
        npm start lance node build/index.js. Stdout reste vide. Le processus attend tant que stdin est ouvert. Ctrl+C pour quitter. Vérifié le 19 octobre 2026 : tsc se termine sans erreur.
      </Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Lister les outils",
    <Stack>
      <CodeBlock code={CMD_LIST} filename="terminal" language="bash" />
      <CodeBlock code={OUT_LIST} filename="tools/list · code 0" language="json" />
      <Note>
        Sans numéro de version, npx a installé l'Inspector 1.0.2, déprécié. On épingle 2.11.0, qui est le tag latest. Sur Node 22.14, un avertissement EBADENGINE peut s'afficher (demandé : Node ≥ 22.19). L'appel a réussi.
      </Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "La réponse réelle d'Open-Meteo",
    <Stack>
      <CodeBlock code={CMD_METEO} filename="terminal" language="bash" />
      <CodeBlock code={OUT_METEO} filename="meteo_lome · 19 octobre 2026, 09:30 UTC" language="text" />
      <CodeBlock code={CMD_PLUIE} filename="terminal" language="bash" />
      <CodeBlock code={OUT_PLUIE} filename="risque_pluie · seuil 5 mm/h" language="text" />
      <Note>Les chiffres changent dans la journée. La forme du texte, non.</Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Zod arrête un mauvais seuil",
    <Stack>
      <CodeBlock code={CMD_ZOD} filename="terminal" language="bash" />
      <CodeBlock code={OUT_ZOD} filename="risque_pluie · seuil_mm=-3" language="text" />
      <Note>
        Le handler n'est pas appelé. Un appel sans seuil utilise 5 mm/h, le défaut du code. Le dépôt rejoue les mêmes appels avec npm test.
      </Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Brancher Cursor",
    <Stack>
      <Note>
        Ouvre le dossier example-server pour que ${"{workspaceFolder}"} pointe vers build/index.js. Compile avant d'activer.
      </Note>
      <CodeBlock code={mcpJson} filename=".cursor/mcp.json" language="json" />
      <p className="text-[1.2rem]">Variante avec tsx, sans build. Elle n'a pas servi au test Inspector.</p>
      <CodeBlock code={MCP_TSX} filename=".cursor/mcp.json · variante" language="json" />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Activer, puis parler à l'agent",
    <Stack>
      <Bullets
        items={[
          "Customize → MCP. Le serveur meteo-lome doit apparaître, avec deux outils.",
          "S'il manque : vérifier le JSON, le chemin, puis relancer Cursor.",
          "Pose une question. Cursor montre l'appel et attend ton accord.",
          "« Quel temps fait-il à Lomé ? » appelle meteo_lome.",
          "« Y a-t-il un risque de forte pluie demain ? » appelle risque_pluie.",
        ]}
      />
    </Stack>,
  ),
  slide(
    "Suite",
    "Quand ça ne marche pas",
    <Bullets
      items={[
        "Chemin : ${workspaceFolder} est le dossier qui contient .cursor/. Un chemin absolu marche aussi, il casse sur une autre machine.",
        "build/index.js absent : relancer npm run build.",
        "Node trop ancien pour l'Inspector 2.11 : l'avertissement EBADENGINE n'empêche pas l'appel sur 22.14, un Node 18 si.",
        "Outil invisible : JSON invalide, serveur désactivé, ou Cursor pas rechargé.",
        "Réponse illisible : un console.log a pollué stdout. Lire MCP Logs.",
        "Rien sur stderr au démarrage : le processus n'a pas démarré. Tester node build/index.js dans le terminal.",
      ]}
    />,
  ),
  slide(
    "Suite",
    "Bonus et défis",
    <Bullets
      items={[
        "Ajouter une ville en argument, avec latitude et longitude validées par Zod.",
        "Exposer une resource, par exemple meteo://lome/maintenant.",
        "Ajouter un prompt « brief météo du matin ».",
        "Passer le même serveur en HTTP streamable, pour un usage à plusieurs.",
        "Publier le paquet sur npm et le lancer avec npx.",
        "Remplacer Open-Meteo par une API locale : base de la startup, docs, lecture Mobile Money.",
      ]}
    />,
  ),
  slide(
    "Clôture",
    "Pour continuer",
    <Bullets
      items={[
        <a key="mcp" className="underline" href="https://modelcontextprotocol.io" target="_blank" rel="noreferrer">modelcontextprotocol.io</a>,
        <a key="cursor" className="underline" href="https://cursor.com/docs/mcp" target="_blank" rel="noreferrer">Documentation MCP de Cursor</a>,
        <a key="sdk" className="underline" href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noreferrer">Dépôt du SDK TypeScript</a>,
        <a key="npm" className="underline" href="https://www.npmjs.com/package/@modelcontextprotocol/sdk" target="_blank" rel="noreferrer">@modelcontextprotocol/sdk sur npm</a>,
        <a key="meteo" className="underline" href="https://open-meteo.com/en/docs" target="_blank" rel="noreferrer">Documentation Open-Meteo</a>,
        <a key="inspector" className="underline" href="https://github.com/modelcontextprotocol/inspector" target="_blank" rel="noreferrer">MCP Inspector</a>,
      ]}
    />,
  ),
  slide(
    "Clôture",
    "Merci — à vous les questions",
    <Stack>
      <p className="max-w-4xl text-[1.5rem] leading-snug md:text-[2rem]">
        Vous avez un serveur qui parle à Cursor, et une météo de Lomé qui ne sort pas de la tête du modèle.
      </p>
      <p className="font-display text-[1.4rem]">Chaminade Adjolou (Donchaminade)</p>
      <Note>Le code montré est celui de example-server/. npm test et l'Inspector 2.11.0 l'ont appelé pour de vrai.</Note>
    </Stack>,
  ),
];
