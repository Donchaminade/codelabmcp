import serverSource from "../../example-server/src/index.ts?raw";

const MARKERS = {
  imports: 'import { McpServer }',
  constantes: "const LOME = {",
  schema: "const previsionsSchema",
  outils: "function jourLome(",
  lecture: "async function lirePrevisions()",
  serveur: "const server = new McpServer(",
  meteo: 'server.registerTool(\n  "meteo_lome"',
  pluieDeclaration: 'server.registerTool(\n  "risque_pluie"',
  pluieCalcul: "  async ({ seuil_mm }) => {",
  pluieReponse: "      let lecture: string;",
  demarrage: "async function main()",
} as const;

export type ExcerptName = keyof typeof MARKERS;

function cut(source: string): Record<ExcerptName, string> {
  const names = Object.keys(MARKERS) as ExcerptName[];
  const starts = names.map((name) => {
    const position = source.indexOf(MARKERS[name]);
    if (position < 0) {
      throw new Error(`Repère introuvable dans src/index.ts : ${name}`);
    }
    return position;
  });
  starts[0] = 0;
  const parts = {} as Record<ExcerptName, string>;
  names.forEach((name, index) => {
    parts[name] = source.slice(starts[index], starts[index + 1] ?? source.length);
  });
  if (names.map((name) => parts[name]).join("") !== source) {
    throw new Error("Les morceaux ne reconstituent pas src/index.ts.");
  }
  return parts;
}

export const SERVER_SOURCE = serverSource;
export const EXCERPTS = cut(serverSource);
