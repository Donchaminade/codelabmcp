import type { ReactNode } from "react";
import mcpJson from "../../example-server/.cursor/mcp.json?raw";
import packageJson from "../../example-server/package.json?raw";
import tsconfigJson from "../../example-server/tsconfig.json?raw";
import { Bullets, Compare, Note, Stack, Terms } from "../components/Blocks";
import { CodeBlock, OutputBlock } from "../components/CodeBlock";
import { Diagram } from "../components/Diagram";
import { ToolCards } from "../components/ToolCards";
import { EXCERPTS, SERVER_SOURCE } from "./excerpts";
import {
  CMD_BUILD,
  CMD_CHECK,
  CMD_FOLDER,
  CMD_LIST,
  CMD_LS,
  CMD_METEO,
  CMD_NPM_I,
  CMD_NPM_I_DEV,
  CMD_NPM_INIT,
  CMD_PLUIE,
  CMD_START,
  CMD_ZOD,
  MCP_TSX,
  OUT_BUILD,
  OUT_CHECK,
  OUT_LIST,
  OUT_LS,
  OUT_METEO,
  OUT_NPM_I,
  OUT_NPM_I_DEV,
  OUT_NPM_INIT,
  OUT_PLUIE,
  OUT_START,
  OUT_ZOD,
  RPC_REQUEST,
  RPC_RESPONSE,
  TREE,
  VERSIONS,
} from "./outputs";

export type SlideLayout = "cover" | "section" | "content" | "closing";

export type Slide = {
  section: string;
  title: string;
  content?: ReactNode;
  layout: SlideLayout;
  number?: string;
  subtitle?: string;
};

function slide(section: string, title: string, content: ReactNode): Slide {
  return { section, title, content, layout: "content" };
}

function divider(section: string, number: string, title: string, subtitle: string): Slide {
  return { section, title, number, subtitle, layout: "section" };
}

function Pair({ children }: { children: ReactNode }) {
  return <div className="grid min-w-0 gap-4 xl:grid-cols-2">{children}</div>;
}

function Split({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      {children}
    </div>
  );
}

function C({ children }: { children: ReactNode }) {
  return <code className="bg-surface-2 px-1 font-mono text-[0.92em] text-accent">{children}</code>;
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="font-mono text-[18px] text-accent underline" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function Piece({
  number,
  code,
  explanations,
  note,
}: {
  number: number;
  code: string;
  explanations: [string, ReactNode][];
  note?: ReactNode;
}) {
  return (
    <Split>
      <CodeBlock code={code} filename={`src/index.ts · morceau ${number} sur 11`} language="typescript" />
      <Stack>
        <Terms items={explanations} />
        {note ? <Note>{note}</Note> : null}
      </Stack>
    </Split>
  );
}

export const slides: Slide[] = [
  {
    section: "Ouverture",
    title: "Crée ton propre serveur MCP",
    layout: "cover",
    subtitle: "et branche-le à Cursor",
    content: (
      <Stack>
        <p className="max-w-3xl text-[1.3rem] leading-snug md:text-[clamp(1.4rem,1.8vw,2.1rem)]">
          Branche un outil réel à l'agent de Cursor. Aujourd'hui, il répond avec la météo de Lomé, pas avec une estimation.
        </p>
        <p className="text-[1.15rem] text-muted md:text-[1.4rem]">
          Communauté tech de Lomé · environ 2 heures · débutants inclus
        </p>
        <p className="font-display text-[1.35rem] md:text-[1.6rem]">
          Chaminade Adjolou <span className="text-accent">(Donchaminade)</span>
        </p>
        <p className="max-w-3xl text-[1rem] text-muted md:text-[1.1rem]">
          Flèches ou Espace pour avancer · glisser sur mobile · S sommaire · T thème · F plein écran
        </p>
      </Stack>
    ),
  },
  slide(
    "Ouverture",
    "Le programme",
    <Stack>
      <Bullets
        items={[
          "Les mots à connaître : modèle, agent, outil, API, serveur, protocole, JSON, terminal.",
          "La théorie de MCP : à quoi il sert, comment un message circule, ce que fait Cursor.",
          "La pratique : un serveur en TypeScript avec deux outils qui lisent la vraie météo de Lomé.",
          "Le branchement : Cursor lance le serveur, et l'agent l'utilise pour répondre.",
        ]}
      />
      <Note>
        Aucune connaissance préalable n'est nécessaire. Chaque terme, chaque commande et chaque bout de code est expliqué. Aucune clé API, rien à payer, le serveur reste sur ta machine.
      </Note>
    </Stack>,
  ),
  slide(
    "Ouverture",
    "Comment lire ce codelab",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_CHECK} filename="terminal" language="bash" />
        <OutputBlock code={OUT_CHECK} label="ce que le terminal affiche" />
      </Pair>
      <Terms
        mono={false}
        columns={2}
        items={[
          [
            "Bloc « À copier »",
            "Bordure pleine et bouton Copier. C'est ce que tu tapes, ou colles, dans le terminal ou dans un fichier.",
          ],
          [
            "Bloc « Résultat attendu »",
            "Bordure en pointillés, sans bouton. C'est ce que tu dois voir ensuite. Ne le copie pas : compare.",
          ],
          [
            "Bloc « Exemple à lire »",
            "Même style que le résultat. Il illustre une idée de la théorie ; il n'y a rien à taper.",
          ],
          [
            "Lire avant de copier",
            "Sous chaque bloc, chaque mot est expliqué. Lis l'explication d'abord : tu sauras quoi faire si le résultat diffère.",
          ],
        ]}
      />
    </Stack>,
  ),
  divider(
    "Théorie",
    "01",
    "Partie 1 — Comprendre MCP",
    "Les mots de base, puis le protocole, pas à pas, avec des exemples.",
  ),
  slide(
    "Théorie",
    "Les mots à connaître (1/2)",
    <Terms
      mono={false}
      columns={2}
      items={[
        [
          "Modèle de langage (LLM)",
          "Le programme d'IA qui lit ta question et écrit une réponse, comme ChatGPT ou Claude. Il a appris sur des textes : il ne sait pas ce qui se passe maintenant.",
        ],
        [
          "Prompt",
          "Le texte que tu envoies au modèle : ta question, ou une consigne. « Quel temps fait-il à Lomé ? » est un prompt.",
        ],
        [
          "Agent",
          "Un modèle qui peut faire des actions en plus d'écrire : lire un fichier, lancer une commande, appeler un outil. L'agent de Cursor en est un.",
        ],
        [
          "Outil (tool)",
          "Une fonction qu'on met à la disposition de l'agent, avec un nom et une description. L'agent décide de l'appeler quand la question s'y prête.",
        ],
      ]}
    />,
  ),
  slide(
    "Théorie",
    "Les mots à connaître (2/2)",
    <Terms
      mono={false}
      columns={2}
      items={[
        [
          "API",
          "Une porte d'entrée vers un service, faite pour les programmes. On envoie une requête à une adresse web, on reçoit des données. Open-Meteo est une API météo.",
        ],
        [
          "Serveur",
          "Un programme qui attend qu'on lui demande quelque chose et qui répond. Le nôtre attend les demandes de Cursor.",
        ],
        [
          "Protocole",
          "Des règles communes pour se parler : quel message envoyer, sous quelle forme, et quelle réponse attendre. Comme une langue partagée.",
        ],
        [
          "JSON",
          "Un format de texte pour échanger des données : des paires « nom : valeur » entre accolades. Exemple : { \"ville\": \"Lomé\", \"temp\": 31 }.",
        ],
        [
          "Terminal",
          "Une fenêtre où l'on tape des commandes au clavier au lieu de cliquer. Chaque ligne tapée puis validée avec Entrée lance un programme.",
        ],
        [
          "Node.js",
          "Le programme qui exécute du JavaScript sur ton ordinateur, en dehors du navigateur. Notre serveur tourne avec Node.js.",
        ],
      ]}
    />,
  ),
  slide(
    "Théorie",
    "Répondre, ou agir",
    <Stack>
      <Compare
        left={{
          title: "Un modèle qui répond",
          points: [
            "Il écrit à partir de ce qu'il a lu pendant son entraînement.",
            "« Il fait 30 °C à Lomé » peut être une supposition, présentée avec assurance.",
            "Il ne voit ni l'heure, ni ta base de données, ni tes fichiers.",
          ],
        }}
        right={{
          title: "Un modèle qui agit",
          points: [
            "Il appelle un outil, attend le résultat, puis rédige la réponse avec ce résultat.",
            "La température vient de l'API Open-Meteo, à cette minute.",
            "L'outil fixe les limites : ici, il ne peut que lire la météo.",
          ],
        }}
      />
      <Note>
        MCP sert à passer de la colonne de gauche à celle de droite : donner des outils au modèle, d'une façon standard.
      </Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Ce qui se passe quand tu demandes la météo",
    <Bullets
      items={[
        "Tu écris à l'agent de Cursor : « Quel temps fait-il à Lomé ? ».",
        "Cursor envoie ta question au modèle, avec la liste des outils disponibles et leurs descriptions.",
        "Le modèle voit l'outil meteo_lome et répond : « appelle meteo_lome ».",
        "Cursor te montre l'appel et attend ton accord, puis envoie la demande à notre serveur.",
        "Notre serveur interroge Open-Meteo sur Internet et renvoie un texte : 31,4 °C, 0 mm, vent 9,2 km/h.",
        "Le modèle lit ce texte et rédige la réponse finale en français.",
      ]}
    />,
  ),
  slide(
    "Théorie",
    "MCP : le Model Context Protocol",
    <Stack>
      <Terms
        mono={false}
        columns={2}
        items={[
          [
            "Ce que c'est",
            "Un protocole ouvert, publié par Anthropic fin 2024. Il dit comment une application d'IA découvre des outils et les appelle.",
          ],
          [
            "Le nom",
            "Model : le modèle d'IA. Context : les informations qu'on lui donne en plus de ta question. Protocol : les règles de l'échange.",
          ],
          [
            "Une image",
            "Une prise standard. Sans elle, chaque application d'IA inventerait son branchement. Avec MCP, un serveur écrit une fois marche dans Cursor, dans d'autres éditeurs, ou dans un script.",
          ],
          [
            "Ce qu'il transporte",
            "Des messages JSON qui suivent JSON-RPC, une convention simple : une demande avec un nom de méthode, une réponse avec le même numéro.",
          ],
        ]}
      />
      <p>
        <Link href="https://modelcontextprotocol.io">modelcontextprotocol.io</Link>
      </p>
    </Stack>,
  ),
  slide(
    "Théorie",
    "À quoi ressemble un message MCP",
    <Stack>
      <Pair>
        <OutputBlock code={RPC_REQUEST} label="demande envoyée par Cursor" kind="example" />
        <OutputBlock code={RPC_RESPONSE} label="réponse de notre serveur" kind="example" />
      </Pair>
      <Terms
        columns={2}
        items={[
          ['"jsonrpc": "2.0"', "La version de la convention JSON-RPC. Toujours la même valeur."],
          ['"id": 3', "Le numéro de la demande. La réponse porte le même numéro, pour qu'on sache à quoi elle répond."],
          ['"method": "tools/call"', "Ce qu'on demande : appeler un outil. tools/list, elle, demande la liste des outils."],
          ['"params"', "Les détails : le nom de l'outil et ses arguments. meteo_lome n'en a pas, d'où {}."],
        ]}
      />
      <Note>Tu n'écris jamais ces messages à la main : le SDK MCP les fabrique et les lit pour toi. C'est un exemple simplifié.</Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Trois choses qu'un serveur peut offrir",
    <Stack>
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          [
            "Tool — outil",
            "Une action que le modèle peut lancer, avec des arguments.",
            "meteo_lome, risque_pluie.",
            "Le modèle, avec ton accord.",
          ],
          [
            "Resource — ressource",
            "Un contenu à lire, repéré par une adresse (URI).",
            "meteo://lome/maintenant, un document interne.",
            "L'application ou toi.",
          ],
          [
            "Prompt — modèle de message",
            "Une question toute prête, avec des trous à remplir.",
            "« Fais-moi le brief météo du matin ».",
            "Toi, en le choisissant.",
          ],
        ].map(([title, text, example, who]) => (
          <article key={title} className="border border-line bg-surface p-5">
            <h3 className="font-display text-[1.6rem] font-bold text-accent md:text-[1.9rem]">{title}</h3>
            <p className="mt-3 text-[1.2rem] leading-snug">{text}</p>
            <p className="mt-3 text-[1.1rem] leading-snug text-muted">Exemple : {example}</p>
            <p className="mt-2 text-[1.1rem] leading-snug text-muted">Qui le déclenche : {who}</p>
          </article>
        ))}
      </div>
      <Note>Aujourd'hui on construit uniquement des tools. Resources et prompts sont dans les défis bonus.</Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Host, client, server : qui fait quoi",
    <Stack>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          [
            "Host (hôte)",
            "L'application que tu utilises : ici Cursor. Elle contient la conversation, l'agent et les réglages.",
            "Le restaurant.",
          ],
          [
            "Client",
            "Le connecteur MCP à l'intérieur de Cursor. Il y en a un par serveur branché. Il envoie les demandes et reçoit les réponses.",
            "Le serveur de salle qui porte la commande.",
          ],
          [
            "Server (serveur)",
            "Notre programme. Il annonce ses outils et exécute ceux qu'on lui demande.",
            "La cuisine.",
          ],
        ].map(([title, text, image]) => (
          <article key={title} className="border border-line border-l-4 border-l-accent bg-surface p-5">
            <h3 className="font-display text-[1.6rem] font-bold md:text-[2rem]">{title}</h3>
            <p className="mt-3 text-[1.2rem] leading-snug">{text}</p>
            <p className="mt-3 text-[1.1rem] text-muted">Image : {image}</p>
          </article>
        ))}
      </div>
      <Note>Attention au mot « serveur » : ici, c'est un petit programme sur ton ordinateur, pas une machine dans un centre de données.</Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "stdin, stdout, stderr : les trois tuyaux",
    <Stack>
      <Terms
        items={[
          ["stdin (entrée standard)", "Ce que le programme reçoit. Quand Cursor lance notre serveur, il lui écrit les demandes JSON ici."],
          ["stdout (sortie standard)", "Ce que le programme renvoie. Notre serveur y écrit les réponses JSON, et rien d'autre."],
          ["stderr (sortie d'erreur)", "Un deuxième canal de sortie, pour les messages destinés aux humains : logs, erreurs. Cursor l'affiche dans ses logs, sans le lire comme du JSON."],
        ]}
      />
      <Note>
        Règle d'or : en JavaScript, <C>console.log</C> écrit sur stdout et casse le dialogue. <C>console.error</C> écrit sur stderr et ne gêne pas. Notre serveur n'utilise que <C>console.error</C>.
      </Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "stdio ou HTTP : deux façons de se brancher",
    <Stack>
      <Compare
        left={{
          title: "stdio (celle de l'atelier)",
          points: [
            "Cursor démarre lui-même notre programme sur ta machine.",
            "Les messages passent par stdin et stdout.",
            "Rien n'écoute sur le réseau : personne d'autre ne peut s'y connecter.",
            "Pas de mot de passe ni de serveur à louer.",
          ],
        }}
        right={{
          title: "HTTP streamable",
          points: [
            "Le serveur tourne en permanence à une adresse web (URL).",
            "Plusieurs personnes ou machines peuvent l'utiliser.",
            "Il faut gérer le réseau, l'authentification et les secrets.",
            "On le garde pour un défi bonus.",
          ],
        }}
      />
      <Note>« Transport » est le nom technique de cette façon de faire passer les messages. Dans le code, on utilisera StdioServerTransport.</Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Comment Cursor utilise un serveur MCP",
    <Bullets
      items={[
        "Au démarrage, Cursor lit le fichier .cursor/mcp.json pour savoir quels serveurs lancer.",
        "Il lance chaque serveur, puis lui demande la liste de ses outils (tools/list).",
        "Les serveurs se gèrent dans Customize, section MCP : on peut les activer ou les désactiver.",
        "Pendant une conversation, l'agent lit les noms et descriptions des outils et choisit d'en appeler un.",
        "Par défaut, Cursor demande ton accord avant chaque appel et te montre les arguments.",
        "En cas de souci, les logs sont dans le panneau Output, canal « MCP Logs ».",
      ]}
    />,
  ),
  slide(
    "Théorie",
    "Le fichier mcp.json, ligne par ligne",
    <Split>
      <OutputBlock code={mcpJson} label=".cursor/mcp.json · on le crée en pratique" kind="example" />
      <Terms
        items={[
          ['"mcpServers"', "La liste des serveurs que Cursor doit connaître."],
          ['"meteo-lome"', "Le nom qu'on donne à notre serveur. Il apparaîtra dans les réglages de Cursor."],
          ['"type": "stdio"', "Le transport : Cursor lance le programme et parle par stdin/stdout."],
          ['"command": "node"', "Le programme à lancer : Node.js."],
          ['"args": [...]', "Ce qu'on donne à node : le chemin du fichier compilé, build/index.js."],
          ["${workspaceFolder}", "Remplacé par Cursor par le chemin du dossier ouvert. Ainsi le fichier marche sur toutes les machines."],
        ]}
      />
    </Split>,
  ),
  slide(
    "Théorie",
    "Deux emplacements pour mcp.json",
    <Stack>
      <Terms
        items={[
          [".cursor/mcp.json (projet)", "Dans le dossier du projet. Il voyage avec le code et sert à toute l'équipe. N'y mets jamais de mot de passe."],
          ["~/.cursor/mcp.json (global)", "Dans ton dossier personnel (~ veut dire « mon dossier utilisateur »). Il vaut pour toutes tes fenêtres Cursor."],
          ["Même nom des deux côtés", "C'est la version du projet qui gagne."],
          ["${workspaceFolder}, ${userHome}, ${env:NOM}", "Des variables que Cursor remplace : dossier ouvert, dossier personnel, variable d'environnement NOM."],
        ]}
      />
      <p>
        <Link href="https://cursor.com/docs/mcp">cursor.com/docs/mcp</Link>
      </p>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Pourquoi écrire son propre serveur",
    <Bullets
      items={[
        "Le modèle ne connaît pas la météo de cette heure à Lomé. Un outil, si.",
        "Tes règles tiennent dans un seul fichier : lecture seule, seuil de pluie, réponse en français.",
        "Tu peux lire tout le code avant de l'activer. Un serveur téléchargé, il faut lui faire confiance.",
        "Tout l'atelier tient dans un dossier, sans compte cloud ni carte bancaire.",
      ]}
    />,
  ),
  slide(
    "Théorie",
    "Des usages concrets, ici",
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {[
        ["Météo à Lomé", "L'exercice : température, pluie et vent, via Open-Meteo."],
        ["Fortes pluies", "Un seuil sur les millimètres prévus. Utile en saison des pluies."],
        ["Base d'une startup", "Lire des commandes ou un stock. Écrire serait un autre outil, plus surveillé."],
        ["Mobile Money", "Consulter un solde ou un reçu. Jamais envoyer d'argent depuis l'agent."],
        ["Documents internes", "Une resource : le modèle cite le document au lieu d'inventer."],
        ["GitHub", "Issues, pull requests, CI : le dépôt devient une source fiable."],
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
        Cursor lance le serveur sur ta machine. Le serveur appelle Open-Meteo sur Internet (HTTPS, en sortie). Aucun port n'est ouvert chez toi : personne ne peut entrer.
      </Note>
    </Stack>,
  ),
  slide(
    "Théorie",
    "Sécurité : ce qu'il ne faut pas faire",
    <Terms
      mono={false}
      columns={2}
      items={[
        ["Pas de console.log", "stdout est réservé au protocole. Un console.log casse la conversation avec Cursor."],
        ["Pas de secret dans le code", "Clés et mots de passe vont dans des variables d'environnement, jamais dans git."],
        ["Lecture d'abord", "Un outil qui lit est sans danger. Un outil qui écrit, paie ou supprime demande beaucoup plus de contrôles."],
        ["Pas de données personnelles", "Ne renvoie au modèle que ce dont il a besoin pour répondre."],
        ["Garde ton accord", "Laisse Cursor te demander avant chaque appel, et lis les arguments."],
        ["Lis avant d'activer", "Un serveur MCP reçu de quelqu'un exécute du code sur ta machine. Lis-le d'abord."],
      ]}
    />,
  ),
  divider(
    "Outils",
    "02",
    "La boîte à outils",
    "Tout ce qui sert pendant la pratique, avec son rôle et son lien officiel.",
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
    "Outils",
    "Node, npm, npx : ne pas les confondre",
    <Terms
      items={[
        ["node", "Exécute un fichier JavaScript. node build/index.js lance notre serveur."],
        ["npm", "Le gestionnaire de paquets, installé avec Node. Il télécharge les librairies dans le dossier node_modules et lance les scripts du projet (npm run build)."],
        ["npx", "Lance un outil publié sur npm sans l'installer dans le projet. On s'en sert pour l'Inspector. La première fois, il demande « Ok to proceed? » : tape y puis Entrée."],
        ["paquet (package)", "Une librairie publiée sur npmjs.com, avec un nom et une version, par exemple zod@4.6.7."],
      ]}
    />,
  ),
  slide(
    "Outils",
    "TypeScript, compilation, tsx, Zod",
    <Terms
      items={[
        ["TypeScript", "Du JavaScript avec des types : on précise qu'une valeur est un nombre, un texte… L'éditeur signale les erreurs avant l'exécution."],
        ["Compiler (tsc)", "Node ne lit pas directement le TypeScript. tsc, le compilateur, traduit src/index.ts en JavaScript dans build/index.js."],
        ["tsx", "Un raccourci pour le développement : il exécute le .ts directement, sans passer par build/."],
        ["Zod", "Une librairie qui vérifie la forme des données : « seuil_mm doit être un nombre entre 0 et 100 ». Si ce n'est pas le cas, la donnée est refusée."],
        ["SDK", "Software Development Kit : une boîte de code prêt à l'emploi. Le SDK MCP gère le protocole pour qu'on écrive seulement nos outils."],
      ]}
    />,
  ),
  divider(
    "Pratique",
    "03",
    "Partie 2 — Construire le serveur",
    "Chaque commande, chaque fichier, chaque morceau de code, expliqués avant d'être copiés.",
  ),
  slide(
    "Pratique",
    "Étape 0 : ouvrir un terminal",
    <Stack>
      <Terms
        mono={false}
        items={[
          ["Dans Cursor", "Menu Terminal → New Terminal, ou le raccourci Ctrl + ` (la touche à gauche du 1). Un panneau s'ouvre en bas."],
          ["Sous Windows", "Le terminal de Cursor utilise PowerShell. Toutes les commandes de ce codelab y fonctionnent telles quelles."],
          ["Sous macOS ou Linux", "Le terminal de Cursor, ou l'application Terminal du système."],
          ["Taper une commande", "Colle la commande, puis appuie sur Entrée. Attends que le curseur revienne avant de lancer la suivante."],
          ["Arrêter un programme", "Ctrl + C dans le terminal arrête le programme en cours."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 1 : vérifier la machine",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_CHECK} filename="terminal" language="bash" />
        <OutputBlock code={OUT_CHECK} label="sur la machine de test, 19 octobre 2026" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["node -v", "Affiche la version de Node.js (v pour version). Il faut 20 ou plus : v20, v22…"],
          ["npm -v", "Affiche la version de npm. Elle est installée avec Node, n'importe laquelle récente convient."],
          ["« command not found » ou « n'est pas reconnu »", "Node n'est pas installé. Télécharge la version LTS sur nodejs.org, installe-la, puis ferme et rouvre le terminal."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 2 : créer le dossier du projet",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_FOLDER} filename="terminal" language="bash" />
        <OutputBlock code="(aucun message)" label="c'est normal" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["mkdir example-server", "make directory : crée un dossier nommé example-server, là où se trouve le terminal."],
          ["cd example-server", "change directory : entre dans ce dossier. Toutes les commandes suivantes s'y exécutent."],
          ["Où suis-je ?", "Tape pwd (macOS, Linux, PowerShell) : le chemin affiché doit se terminer par example-server."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 3 : initialiser le projet npm",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_NPM_INIT} filename="terminal" language="bash" />
        <OutputBlock code={OUT_NPM_INIT} label="le chemin dépend de ta machine" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["npm init", "Crée le fichier package.json : la carte d'identité du projet (nom, version, scripts, dépendances)."],
          ["-y", "yes : accepte toutes les réponses par défaut au lieu de poser des questions."],
          ["Ce qui change", "Un fichier package.json apparaît dans le dossier. On le remplacera à l'étape 7."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 4 : installer les librairies",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_NPM_I} filename="terminal" language="bash" />
        <OutputBlock code={OUT_NPM_I} label="le nombre de paquets peut varier" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["npm i", "Abréviation de npm install : télécharge des paquets depuis npmjs.com."],
          ["@modelcontextprotocol/sdk", "Le SDK officiel de MCP pour TypeScript. Le @ indique un paquet rangé sous une organisation."],
          ["zod", "La librairie de validation des données."],
          ["Ce qui change", "Un dossier node_modules (le code téléchargé) et un fichier package-lock.json (les versions exactes) apparaissent. On n'y touche pas."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 5 : installer les outils de développement",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_NPM_I_DEV} filename="terminal" language="bash" />
        <OutputBlock code={OUT_NPM_I_DEV} label="npm peut ajouter des lignes « funding »" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["-D", "Abréviation de --save-dev : ces paquets servent à écrire et compiler le code, pas à le faire tourner. Ils vont dans devDependencies."],
          ["typescript", "Le compilateur tsc."],
          ["@types/node", "Les descriptions de types de Node.js, pour que TypeScript connaisse process, fetch, etc."],
          ["tsx", "Pour lancer le TypeScript sans compiler pendant le développement."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 6 : vérifier les versions installées",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_LS} filename="terminal" language="bash" />
        <OutputBlock code={OUT_LS} label="versions du 19 octobre 2026" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["npm ls", "list : affiche les paquets installés dans le projet."],
          ["--depth=0", "Seulement les paquets qu'on a demandés, pas leurs propres dépendances."],
          ["Versions différentes ?", "Des chiffres plus récents sont normaux. Le code est écrit pour la ligne 1.x du SDK : si tu vois 2.x, réinstalle avec npm i @modelcontextprotocol/sdk@1."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Ouvrir le dossier dans Cursor et créer les fichiers",
    <Split>
      <OutputBlock code={TREE} label="l'arborescence à obtenir" kind="example" />
      <Terms
        mono={false}
        items={[
          ["Ouvrir le dossier", "File → Open Folder, choisis example-server. Cursor l'affiche dans la barre de gauche (l'explorateur)."],
          ["Créer un fichier", "Clic droit dans l'explorateur → New File, puis tape le nom. Pour src/index.ts, tape src/index.ts : Cursor crée le dossier src."],
          ["Coller le contenu", "Ouvre le fichier, colle le code copié, puis enregistre avec Ctrl + S (Cmd + S sur Mac)."],
          ["build/", "Ne le crée pas : la compilation le fabrique à l'étape 9."],
        ]}
      />
    </Split>,
  ),
  slide(
    "Pratique",
    "Étape 7 : remplacer package.json",
    <Split>
      <CodeBlock code={packageJson} filename="package.json" language="json" />
      <Terms
        items={[
          ['"name", "version"', "Le nom et la version du projet. Libre."],
          ['"type": "module"', "Le projet utilise la syntaxe moderne import … from. Indispensable avec le SDK."],
          ['"main"', "Le fichier principal : la version compilée, build/index.js."],
          ['"scripts"', "Des raccourcis : npm run build lance tsc ; npm start lance le serveur ; npm run dev le lance avec tsx ; npm test rejoue des appels (fichier fourni dans le dépôt)."],
          ['"engines"', "Indique qu'il faut Node 20 ou plus."],
          ['"dependencies" / "devDependencies"', "Ce qu'on a installé aux étapes 4 et 5. Garde ces deux blocs, ou npm ne saura plus quoi installer."],
        ]}
      />
    </Split>,
  ),
  slide(
    "Pratique",
    "Étape 8 : créer tsconfig.json",
    <Split>
      <CodeBlock code={tsconfigJson} filename="tsconfig.json" language="json" />
      <Terms
        items={[
          ['"target": "ES2022"', "La version de JavaScript produite. Node 20 la comprend."],
          ['"module" et "moduleResolution": "Node16"', "Comment les import sont écrits et retrouvés, à la façon de Node. C'est pour ça qu'on importe des chemins en .js."],
          ['"rootDir": "src", "outDir": "build"', "On lit le code dans src/, on écrit le JavaScript dans build/."],
          ['"strict": true', "Le mode le plus vigilant : TypeScript signale plus d'erreurs possibles."],
          ['"skipLibCheck", "types": ["node"]', "On ne revérifie pas les librairies, et on charge les types de Node."],
          ['"include": ["src"]', "Les fichiers à compiler : tout le dossier src."],
        ]}
      />
    </Split>,
  ),
  slide(
    "Pratique",
    "src/index.ts : le plan du fichier",
    <Stack>
      <Bullets
        items={[
          "Morceaux 1 à 3 : importer les librairies, fixer Lomé, décrire la réponse attendue d'Open-Meteo.",
          "Morceaux 4 et 5 : de petites fonctions utiles, puis l'appel à l'API météo.",
          "Morceaux 6 à 10 : créer le serveur MCP et déclarer les deux outils.",
          "Morceau 11 : démarrer le serveur et le brancher sur stdin et stdout.",
        ]}
      />
      <Note>
        Deux façons de faire. Soit tu colles les 11 morceaux à la suite, dans l'ordre, dans src/index.ts. Soit tu lis les explications, puis tu copies le fichier complet à la slide « Le fichier complet ». Le résultat est identique.
      </Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Morceau 1 : les imports",
    <Piece
      number={1}
      code={EXCERPTS.imports}
      explanations={[
        ["import { … } from \"…\"", "Va chercher du code dans un paquet installé et lui donne un nom utilisable ici."],
        ["McpServer", "La classe qui représente notre serveur MCP : on y déclare les outils."],
        ["StdioServerTransport", "Le transport stdio : il lit les demandes sur stdin et écrit les réponses sur stdout."],
        ["z", "Le point d'entrée de Zod. z.number(), z.string()… décrivent des formes de données."],
        [".js à la fin des chemins", "Exigé par le réglage Node16 du tsconfig, même si on écrit du TypeScript."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 2 : les constantes",
    <Piece
      number={2}
      code={EXCERPTS.constantes}
      explanations={[
        ["const", "Déclare une valeur qui ne changera pas."],
        ["LOME", "Les coordonnées GPS de Lomé et son fuseau horaire, Africa/Lome. Change-les pour une autre ville."],
        ["as const", "Dit à TypeScript que ces valeurs sont fixes."],
        ["OPEN_METEO", "L'adresse de l'API de prévisions d'Open-Meteo."],
        ["SEUIL_DEFAUT_MM", "5 mm par heure : au-delà, on parle de forte pluie si l'utilisateur ne donne pas de seuil."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 3 : la forme de la réponse météo",
    <Piece
      number={3}
      code={EXCERPTS.schema}
      explanations={[
        ["z.object({ … })", "Décrit un objet JSON et les champs qu'il doit contenir."],
        ["current", "La météo du moment : heure, température à 2 m du sol, pluie, vent à 10 m."],
        ["current_units", "Les unités renvoyées avec ces valeurs : °C, mm, km/h."],
        ["hourly", "Les prévisions heure par heure : une liste d'heures et une liste de millimètres de pluie."],
        ["z.infer<…>", "Fabrique automatiquement le type TypeScript Previsions à partir du schéma."],
      ]}
      note="Pourquoi vérifier ? Si Open-Meteo change un jour sa réponse, on renvoie une erreur claire au lieu d'un texte faux."
    />,
  ),
  slide(
    "Pratique",
    "Morceau 4 : dates et nombres",
    <Piece
      number={4}
      code={EXCERPTS.outils}
      explanations={[
        ["function jourLome(decalageJours)", "Renvoie une date au format AAAA-MM-JJ, à l'heure de Lomé. jourLome(1) donne la date de demain."],
        ["Intl.DateTimeFormat", "L'outil intégré de JavaScript pour afficher une date dans un fuseau donné."],
        ["Date.UTC(…)", "Construit la date en ajoutant le décalage, sans erreur de fuseau."],
        ["formatNombre(valeur)", "Écrit un nombre à la française : 31,4 avec une virgule, au plus un chiffre après."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 5 : appeler Open-Meteo",
    <Piece
      number={5}
      code={EXCERPTS.lecture}
      explanations={[
        ["async / await", "La fonction attend la réponse d'Internet sans bloquer le programme."],
        ["url.searchParams.set", "Ajoute les paramètres à l'adresse : latitude, longitude, données voulues, fuseau, 2 jours de prévisions."],
        ["fetch(url, …)", "Envoie la requête HTTP. User-Agent présente poliment notre programme ; timeout abandonne après 12 secondes."],
        ["reponse.ok", "Faux si le serveur a répondu avec une erreur (404, 500…). On lève alors une erreur."],
        ["safeParse", "Vérifie la réponse avec le schéma du morceau 3, sans planter le programme."],
        ["texteErreur", "Transforme n'importe quelle erreur en texte lisible pour le modèle."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 6 : créer le serveur",
    <Piece
      number={6}
      code={EXCERPTS.serveur}
      explanations={[
        ["new McpServer({ … })", "Crée le serveur. Il ne fait encore rien : il attend qu'on lui ajoute des outils."],
        ["name", "Le nom technique annoncé à Cursor lors de la connexion."],
        ["version", "La version de notre serveur. Augmente-la quand tu changes ses outils."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 7 : l'outil meteo_lome",
    <Piece
      number={7}
      code={EXCERPTS.meteo}
      explanations={[
        ["server.registerTool(nom, config, fonction)", "Déclare un outil : son nom, sa fiche, et le code à lancer quand on l'appelle."],
        ["title, description", "Ce que lit le modèle pour décider d'utiliser l'outil. Une bonne description est essentielle."],
        ["annotations", "readOnlyHint : l'outil ne modifie rien. openWorldHint : il contacte un service extérieur."],
        ["async () => { … }", "Le handler : la fonction exécutée à chaque appel. Pas d'argument ici."],
        ["return { content: [...] }", "La réponse MCP : une liste de contenus, ici un seul texte."],
        ["try / catch, isError", "Si l'appel échoue, on renvoie le message d'erreur au modèle au lieu de planter."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 8 : l'outil risque_pluie, sa fiche",
    <Piece
      number={8}
      code={EXCERPTS.pluieDeclaration}
      explanations={[
        ["inputSchema", "La liste des arguments acceptés. Cursor la montre au modèle, qui sait ainsi quoi envoyer."],
        ["seuil_mm: z.number()", "Un argument nommé seuil_mm, qui doit être un nombre."],
        [".min(0).max(100)", "Entre 0 et 100. Une valeur hors limites est refusée avant même d'arriver à notre code."],
        [".optional()", "On peut ne pas le donner. On utilisera alors 5."],
        [".describe(\"…\")", "L'explication de l'argument, lue par le modèle."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 9 : risque_pluie, le calcul",
    <Piece
      number={9}
      code={EXCERPTS.pluieCalcul}
      explanations={[
        ["async ({ seuil_mm }) =>", "Le handler reçoit les arguments déjà vérifiés par Zod."],
        ["seuil_mm ?? SEUIL_DEFAUT_MM", "?? veut dire « sinon » : si seuil_mm est absent, on prend 5."],
        ["jourLome(1)", "La date de demain à Lomé, par exemple 2026-10-20."],
        ["forEach", "Parcourt chaque heure de prévision. On garde celles de demain."],
        ["maxMm, cumulMm, heures", "La plus forte pluie horaire, le total de la journée, et le nombre d'heures trouvées."],
        ["heures === 0", "Aucune donnée pour demain : on renvoie une erreur claire."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 10 : risque_pluie, la réponse",
    <Piece
      number={10}
      code={EXCERPTS.pluieReponse}
      explanations={[
        ["let lecture", "Une variable qui recevra la conclusion en français."],
        ["if / else if / else", "Trois cas : au-dessus du seuil (forte pluie), un peu de pluie (légère), ou rien."],
        ["[ … ].join(\"\\n\")", "Assemble les lignes du texte, une par ligne."],
        ["}, );", "Ces lignes ferment le handler puis l'appel registerTool ouverts aux morceaux 8 et 9."],
      ]}
    />,
  ),
  slide(
    "Pratique",
    "Morceau 11 : démarrer le serveur",
    <Piece
      number={11}
      code={EXCERPTS.demarrage}
      explanations={[
        ["async function main()", "La fonction de démarrage."],
        ["new StdioServerTransport()", "Prépare la communication par stdin et stdout."],
        ["server.connect(transport)", "Branche le serveur sur ce transport. À partir de là, il répond aux demandes."],
        ["console.error(\"… prêt\")", "Un message pour les humains, sur stderr. Il ne gêne pas le protocole."],
        ["main().catch(…)", "Si le démarrage échoue, on affiche l'erreur et on quitte avec le code 1 (échec)."],
      ]}
      note="Le fichier est complet. Enregistre-le (Ctrl + S)."
    />,
  ),
  slide(
    "Pratique",
    "Le fichier complet",
    <Split>
      <CodeBlock code={SERVER_SOURCE} filename="src/index.ts" language="typescript" />
      <Stack>
        <Note>
          C'est exactement la somme des 11 morceaux. Si tu as tout collé morceau par morceau, ton fichier doit être identique. Sinon, copie celui-ci d'un coup.
        </Note>
        <Terms
          mono={false}
          items={[
            ["Des traits rouges dans Cursor ?", "Vérifie que les étapes 4 et 5 sont faites (node_modules existe) et que tsconfig.json est bien à la racine du dossier."],
            ["Ne change pas console.error", "Le remplacer par console.log casserait le dialogue avec Cursor."],
          ]}
        />
      </Stack>
    </Split>,
  ),
  slide(
    "Pratique",
    "Étape 9 : compiler",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_BUILD} filename="terminal" language="bash" />
        <OutputBlock code={OUT_BUILD} label="aucune erreur = réussite" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["npm run build", "Lance le script build de package.json, c'est-à-dire tsc."],
          ["> tsc", "npm affiche la commande qu'il exécute. Pas d'autre ligne : la compilation a réussi."],
          ["Ce qui change", "Un dossier build/ apparaît, avec build/index.js : la version JavaScript que Node exécute."],
          ["error TS…", "Une erreur de TypeScript, avec le fichier et la ligne. Compare cette ligne avec le morceau correspondant."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 10 : démarrer à la main, pour tester",
    <Stack>
      <Pair>
        <CodeBlock code={CMD_START} filename="terminal" language="bash" />
        <OutputBlock code={`> meteo-lome-mcp@1.0.0 start\n> node build/index.js\n\n${OUT_START}`} label="le curseur reste bloqué : c'est normal" />
      </Pair>
      <Terms
        columns={3}
        items={[
          ["npm start", "Lance le script start : node build/index.js."],
          ["« prêt (stdio) »", "Le message du morceau 11, écrit sur stderr. Le serveur attend maintenant des demandes JSON sur stdin."],
          ["Il ne rend pas la main", "Normal : un serveur attend. En vrai, c'est Cursor qui le lancera et lui parlera."],
          ["Ctrl + C", "Arrête le serveur pour retrouver le terminal. Fais-le avant l'étape suivante."],
        ]}
      />
    </Stack>,
  ),
  slide(
    "Pratique",
    "La commande MCP Inspector, mot par mot",
    <Stack>
      <OutputBlock code={CMD_METEO} label="la commande de l'étape 12, découpée ci-dessous" kind="example" />
      <Terms
        columns={2}
        items={[
          ["npx", "Télécharge et lance l'Inspector sans l'installer. Réponds y si on te le demande."],
          ["@modelcontextprotocol/inspector@2.11.0", "Le paquet et sa version exacte. Sans version, npx a pris une ancienne 1.0.2."],
          ["--cli", "Mode ligne de commande : pas de page web, juste le résultat dans le terminal."],
          ["node build/index.js", "Le serveur à lancer. L'Inspector joue le rôle de Cursor."],
          ["--method tools/list ou tools/call", "Lister les outils, ou en appeler un."],
          ["--tool-name, --tool-arg clé=valeur", "Le nom de l'outil à appeler et ses arguments."],
        ]}
      />
      <Note>Sur Node 22.14, npm peut afficher un avertissement EBADENGINE (l'Inspector préfère Node 22.19 ou plus). Ce n'est qu'un avertissement : l'appel marche.</Note>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 11 : lister les outils",
    <Split>
      <Stack>
        <CodeBlock code={CMD_LIST} filename="terminal" language="bash" />
        <Terms
          items={[
            ['"name", "title", "description"', "La fiche de chaque outil, telle que déclarée aux morceaux 7 et 8."],
            ['"inputSchema"', "Le schéma Zod traduit en JSON Schema : seuil_mm, nombre, entre 0 et 100."],
            ['"annotations"', "readOnlyHint et openWorldHint, comme dans le code."],
          ]}
        />
      </Stack>
      <OutputBlock code={OUT_LIST} label="tools/list · deux outils" />
    </Split>,
  ),
  slide(
    "Pratique",
    "Étape 12 : appeler meteo_lome",
    <Stack>
      <CodeBlock code={CMD_METEO} filename="terminal" language="bash" />
      <Pair>
        <OutputBlock code={OUT_METEO} label="19 octobre 2026, 09:30 à Lomé" />
        <Terms
          items={[
            ["Les chiffres", "Ils changent avec la météo réelle. La forme du texte, elle, reste la même."],
            ["Heure locale", "L'heure de la mesure, dans le fuseau Africa/Lome."],
            ["Une erreur à la place ?", "Vérifie ta connexion Internet : le serveur doit joindre api.open-meteo.com."],
          ]}
        />
      </Pair>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 13 : appeler risque_pluie",
    <Stack>
      <CodeBlock code={CMD_PLUIE} filename="terminal" language="bash" />
      <Pair>
        <OutputBlock code={OUT_PLUIE} label="prévision pour le 20 octobre 2026" />
        <Terms
          items={[
            ["--tool-arg seuil_mm=5", "On passe l'argument seuil_mm avec la valeur 5. Essaie 0.2 pour voir la lecture changer."],
            ["Maximum horaire", "La plus forte pluie prévue en une heure, demain."],
            ["Cumul", "Le total de pluie prévu sur la journée."],
          ]}
        />
      </Pair>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 14 : Zod refuse un mauvais seuil",
    <Stack>
      <CodeBlock code={CMD_ZOD} filename="terminal" language="bash" />
      <Pair>
        <OutputBlock code={OUT_ZOD} label="seuil_mm=-3 · refusé" />
        <Terms
          items={[
            ["-32602", "Le code JSON-RPC pour « paramètres invalides »."],
            ["Too small: expected number to be >=0", "Le message de Zod : la règle .min(0) du morceau 8 a été violée."],
            ['"isError": true', "La réponse est marquée comme une erreur. Notre handler n'a même pas été appelé."],
            ["code de sortie : 5", "L'Inspector termine avec un code différent de 0 pour signaler l'échec."],
          ]}
        />
      </Pair>
    </Stack>,
  ),
  slide(
    "Pratique",
    "Étape 15 : brancher le serveur à Cursor",
    <Split>
      <CodeBlock code={mcpJson} filename=".cursor/mcp.json" language="json" />
      <Terms
        mono={false}
        items={[
          ["Où le créer", "Dans example-server, crée le dossier .cursor (avec le point) puis le fichier mcp.json dedans. Astuce : New File → .cursor/mcp.json."],
          ["Le dossier ouvert", "Dans Cursor, le dossier ouvert doit être example-server : c'est lui que remplace ${workspaceFolder}."],
          ["Compiler d'abord", "Le fichier pointe vers build/index.js : l'étape 9 doit être faite."],
          ["Chaque mot", "Expliqué à la slide « Le fichier mcp.json, ligne par ligne » de la théorie."],
        ]}
      />
    </Split>,
  ),
  slide(
    "Pratique",
    "Variante : sans compiler, avec tsx",
    <Split>
      <CodeBlock code={MCP_TSX} filename=".cursor/mcp.json · variante tsx" language="json" />
      <Terms
        items={[
          ['"command": "npx"', "Cursor lance npx au lieu de node."],
          ['"args": ["tsx", "src/index.ts"]', "npx lance tsx, qui exécute directement le fichier TypeScript."],
          ["Avantage", "Tes modifications sont prises en compte sans npm run build : il suffit de redémarrer le serveur dans Cursor."],
          ["À savoir", "Les tests Inspector de ce codelab ont été faits avec la version compilée, pas avec cette variante."],
        ]}
      />
    </Split>,
  ),
  slide(
    "Pratique",
    "Étape 16 : activer, puis parler à l'agent",
    <Bullets
      items={[
        "Ouvre Customize, section MCP. Le serveur meteo-lome doit apparaître avec deux outils. Active-le s'il est éteint.",
        "S'il manque : vérifie que le JSON est valide, que le chemin est bon, puis recharge Cursor.",
        "Ouvre l'agent et écris : « Quel temps fait-il à Lomé ? ». Il propose d'appeler meteo_lome.",
        "Cursor affiche l'appel et ses arguments. Accepte : la réponse arrive avec la vraie météo.",
        "Essaie : « Y a-t-il un risque de forte pluie demain à Lomé ? ». L'agent appelle risque_pluie.",
        "Et : « Avec un seuil de 1 mm ? ». L'agent envoie seuil_mm = 1.",
      ]}
    />,
  ),
  divider(
    "Suite",
    "04",
    "Dépanner, puis aller plus loin",
    "Les erreurs fréquentes, et des défis pour continuer après l'atelier.",
  ),
  slide(
    "Suite",
    "Quand ça ne marche pas",
    <Terms
      mono={false}
      columns={2}
      items={[
        ["« Cannot find module …build/index.js »", "La compilation n'a pas été faite, ou pas dans le bon dossier. Lance npm run build dans example-server."],
        ["Le serveur n'apparaît pas dans Cursor", "JSON invalide (virgule en trop), mauvais dossier ouvert, ou Cursor pas rechargé."],
        ["L'outil ne répond pas, ou réponse illisible", "Un console.log a pollué stdout. Remplace-le par console.error. Regarde Output → MCP Logs."],
        ["Erreur réseau / Open-Meteo", "Pas d'accès à Internet, ou un pare-feu bloque api.open-meteo.com."],
        ["« command not found: node »", "Node.js n'est pas installé, ou le terminal a été ouvert avant l'installation : rouvre-le."],
        ["EBADENGINE avec l'Inspector", "Un avertissement sur Node 22.14, sans conséquence. Sur Node 18, en revanche, l'Inspector 2.11 ne marche pas."],
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
  {
    section: "Clôture",
    title: "Merci — à vous les questions",
    layout: "closing",
    content: (
      <Stack>
        <p className="max-w-3xl text-[1.3rem] leading-snug md:text-[clamp(1.4rem,1.8vw,2.1rem)]">
          Vous avez un serveur qui parle à Cursor, et une météo de Lomé qui ne sort pas de la tête du modèle.
        </p>
        <p className="font-display text-[1.35rem] md:text-[1.6rem]">
          Chaminade Adjolou <span className="text-accent">(Donchaminade)</span>
        </p>
        <p className="max-w-3xl text-[1.05rem] text-muted md:text-[1.2rem]">
          Le code montré est celui de example-server/. npm test et l'Inspector 2.11.0 l'ont appelé pour de vrai.
        </p>
      </Stack>
    ),
  },
];
