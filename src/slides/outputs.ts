export const VERSIONS = {
  node: "v22.14.0",
  npm: "10.9.9",
  typescript: "7.0.2",
  typesNode: "26.6.5",
  tsx: "4.23.15",
  sdk: "1.32.1",
  zod: "4.6.7",
  inspector: "2.11.0",
} as const;

export const CMD_CHECK = `node -v
npm -v`;

export const OUT_CHECK = `v22.14.0
10.9.9`;

export const CMD_INIT = `mkdir example-server
cd example-server
npm init -y
npm i @modelcontextprotocol/sdk zod
npm i -D typescript @types/node tsx`;

export const OUT_INSTALL = `added 95 packages, and audited 96 packages in 2s
found 0 vulnerabilities

added 7 packages, and audited 103 packages in 2s
found 0 vulnerabilities

@modelcontextprotocol/sdk  1.32.1
zod                        4.6.7
typescript                 7.0.2
@types/node                26.6.5
tsx                        4.23.15`;

export const CMD_BUILD = `npm run build`;

export const OUT_BUILD = `> meteo-lome-mcp@1.0.0 build
> tsc`;

export const CMD_START = `npm start`;

export const OUT_START = `Serveur MCP « météo Lomé » prêt (stdio).`;

export const CMD_LIST = `npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/list`;

export const OUT_LIST = `{
  "tools": [
    {
      "name": "meteo_lome",
      "title": "Météo à Lomé",
      "description": "Météo actuelle à Lomé (Togo) : température, précipitations et vent. Source gratuite Open-Meteo, sans clé API.",
      "inputSchema": {
        "type": "object",
        "properties": {}
      },
      "annotations": {
        "readOnlyHint": true,
        "openWorldHint": true
      },
      "execution": {
        "taskSupport": "forbidden"
      }
    },
    {
      "name": "risque_pluie",
      "title": "Risque de pluie à Lomé",
      "description": "Estime le risque de forte pluie demain à Lomé à partir des précipitations horaires prévues par Open-Meteo.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "seuil_mm": {
            "description": "Seuil horaire en millimètres. Au-delà, la pluie est considérée comme forte. Défaut : 5.",
            "type": "number",
            "minimum": 0,
            "maximum": 100
          }
        },
        "$schema": "http://json-schema.org/draft-07/schema#"
      },
      "annotations": {
        "readOnlyHint": true,
        "openWorldHint": true
      },
      "execution": {
        "taskSupport": "forbidden"
      }
    }
  ]
}`;

export const CMD_METEO = `npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/call --tool-name meteo_lome`;

export const OUT_METEO = `Météo actuelle à Lomé (Togo)
Heure locale : 2026-10-19T09:30
Température : 31,4 °C
Précipitations : 0 mm
Vent : 9,2 km/h
Source : Open-Meteo (aucune clé API).`;

export const CMD_PLUIE = `npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/call --tool-name risque_pluie --tool-arg seuil_mm=5`;

export const OUT_PLUIE = `Risque de pluie à Lomé — demain (2026-10-20)
Seuil retenu : 5 mm/h
Maximum horaire prévu : 0,3 mm
Cumul sur la journée : 1,2 mm
Lecture : pluie légère possible, sous le seuil de forte pluie.`;

export const CMD_ZOD = `npx @modelcontextprotocol/inspector@2.11.0 --cli node build/index.js --method tools/call --tool-name risque_pluie --tool-arg seuil_mm=-3`;

export const OUT_ZOD = `{
  "content": [
    {
      "type": "text",
      "text": "MCP error -32602: Input validation error: Invalid arguments for tool risque_pluie: Too small: expected number to be >=0 at seuil_mm"
    }
  ],
  "isError": true
}
code de sortie : 5`;

export const MCP_TSX = `{
  "mcpServers": {
    "meteo-lome": {
      "type": "stdio",
      "command": "npx",
      "args": ["tsx", "src/index.ts"]
    }
  }
}`;

export const TREE = `example-server/
├── .cursor/
│   └── mcp.json
├── src/
│   └── index.ts
├── package.json
├── package-lock.json
└── tsconfig.json

Après npm run build :
└── build/
    └── index.js`;
