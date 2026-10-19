import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const LOME = {
  nom: "Lomé",
  latitude: 6.1319,
  longitude: 1.2228,
  fuseau: "Africa/Lome",
} as const;

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const SEUIL_DEFAUT_MM = 5;

const previsionsSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    precipitation: z.number(),
    wind_speed_10m: z.number(),
  }),
  current_units: z.object({
    temperature_2m: z.string(),
    precipitation: z.string(),
    wind_speed_10m: z.string(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    precipitation: z.array(z.number()),
  }),
});

type Previsions = z.infer<typeof previsionsSchema>;

function jourLome(decalageJours: number): string {
  const format = new Intl.DateTimeFormat("en-CA", {
    timeZone: LOME.fuseau,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const aujourdhui = format.format(new Date());
  const [annee, mois, jour] = aujourdhui.split("-").map(Number);
  const date = new Date(Date.UTC(annee, mois - 1, jour + decalageJours));
  return date.toISOString().slice(0, 10);
}

function formatNombre(valeur: number): string {
  return valeur.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
}

async function lirePrevisions(): Promise<Previsions> {
  const url = new URL(OPEN_METEO);
  url.searchParams.set("latitude", String(LOME.latitude));
  url.searchParams.set("longitude", String(LOME.longitude));
  url.searchParams.set("current", "temperature_2m,precipitation,wind_speed_10m");
  url.searchParams.set("hourly", "precipitation");
  url.searchParams.set("timezone", LOME.fuseau);
  url.searchParams.set("forecast_days", "2");

  const reponse = await fetch(url, {
    headers: { "User-Agent": "meteo-lome-mcp/1.0" },
    signal: AbortSignal.timeout(12_000),
  });

  if (!reponse.ok) {
    throw new Error(`Open-Meteo a répondu HTTP ${reponse.status}`);
  }

  const brut: unknown = await reponse.json();
  const valide = previsionsSchema.safeParse(brut);
  if (!valide.success) {
    throw new Error("Réponse Open-Meteo inattendue.");
  }
  return valide.data;
}

function texteErreur(error: unknown): string {
  return error instanceof Error ? error.message : "Erreur inconnue";
}

const server = new McpServer({
  name: "meteo-lome",
  version: "1.0.0",
});

server.registerTool(
  "meteo_lome",
  {
    title: "Météo à Lomé",
    description:
      "Météo actuelle à Lomé (Togo) : température, précipitations et vent. Source gratuite Open-Meteo, sans clé API.",
    annotations: {
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  async () => {
    try {
      const meteo = await lirePrevisions();
      const unites = meteo.current_units;
      const texte = [
        `Météo actuelle à ${LOME.nom} (Togo)`,
        `Heure locale : ${meteo.current.time}`,
        `Température : ${formatNombre(meteo.current.temperature_2m)} ${unites.temperature_2m}`,
        `Précipitations : ${formatNombre(meteo.current.precipitation)} ${unites.precipitation}`,
        `Vent : ${formatNombre(meteo.current.wind_speed_10m)} ${unites.wind_speed_10m}`,
        "Source : Open-Meteo (aucune clé API).",
      ].join("\n");

      return { content: [{ type: "text", text: texte }] };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: texteErreur(error) }],
      };
    }
  },
);

server.registerTool(
  "risque_pluie",
  {
    title: "Risque de pluie à Lomé",
    description:
      "Estime le risque de forte pluie demain à Lomé à partir des précipitations horaires prévues par Open-Meteo.",
    inputSchema: {
      seuil_mm: z
        .number()
        .min(0)
        .max(100)
        .optional()
        .describe(
          "Seuil horaire en millimètres. Au-delà, la pluie est considérée comme forte. Défaut : 5.",
        ),
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  async ({ seuil_mm }) => {
    const seuil = seuil_mm ?? SEUIL_DEFAUT_MM;

    try {
      const meteo = await lirePrevisions();
      const demain = jourLome(1);
      let maxMm = 0;
      let cumulMm = 0;
      let heures = 0;

      meteo.hourly.time.forEach((heure, index) => {
        if (!heure.startsWith(demain)) {
          return;
        }
        const mm = meteo.hourly.precipitation[index] ?? 0;
        heures += 1;
        cumulMm += mm;
        if (mm > maxMm) {
          maxMm = mm;
        }
      });

      if (heures === 0) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Aucune heure de prévision pour le ${demain}.`,
            },
          ],
        };
      }

      let lecture: string;
      if (maxMm >= seuil) {
        lecture = "risque de forte pluie demain.";
      } else if (maxMm > 0) {
        lecture = "pluie légère possible, sous le seuil de forte pluie.";
      } else {
        lecture = "pas de pluie prévue demain.";
      }

      const texte = [
        `Risque de pluie à ${LOME.nom} — demain (${demain})`,
        `Seuil retenu : ${formatNombre(seuil)} mm/h`,
        `Maximum horaire prévu : ${formatNombre(maxMm)} mm`,
        `Cumul sur la journée : ${formatNombre(cumulMm)} mm`,
        `Lecture : ${lecture}`,
      ].join("\n");

      return { content: [{ type: "text", text: texte }] };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: texteErreur(error) }],
      };
    }
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Serveur MCP « météo Lomé » prêt (stdio).");
}

main().catch((error: unknown) => {
  console.error("Le serveur MCP s'est arrêté :", error);
  process.exit(1);
});
