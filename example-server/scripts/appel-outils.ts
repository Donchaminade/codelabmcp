import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["build/index.js"],
  stderr: "pipe",
});

const morceauxStderr: Buffer[] = [];
transport.stderr?.on("data", (morceau: Buffer) => {
  morceauxStderr.push(morceau);
});

const client = new Client(
  { name: "appel-outils", version: "1.0.0" },
  { capabilities: {} },
);

await client.connect(transport);

const outils = await client.listTools();
console.log("=== tools/list ===");
for (const outil of outils.tools) {
  console.log(`- ${outil.name} : ${outil.description ?? ""}`);
}

const meteo = await client.callTool({ name: "meteo_lome", arguments: {} });
console.log("\n=== tools/call meteo_lome ===");
console.log(JSON.stringify(meteo, null, 2));

const risque = await client.callTool({
  name: "risque_pluie",
  arguments: { seuil_mm: 5 },
});
console.log("\n=== tools/call risque_pluie { seuil_mm: 5 } ===");
console.log(JSON.stringify(risque, null, 2));

const risqueDefaut = await client.callTool({
  name: "risque_pluie",
  arguments: {},
});
console.log("\n=== tools/call risque_pluie {} ===");
console.log(JSON.stringify(risqueDefaut, null, 2));

try {
  const invalide = await client.callTool({
    name: "risque_pluie",
    arguments: { seuil_mm: -3 },
  });
  console.log("\n=== tools/call risque_pluie { seuil_mm: -3 } ===");
  console.log(JSON.stringify(invalide, null, 2));
} catch (error) {
  console.log("\n=== tools/call risque_pluie { seuil_mm: -3 } ===");
  console.log(error instanceof Error ? error.message : String(error));
}

console.log("\n=== stderr du serveur ===");
console.log(Buffer.concat(morceauxStderr).toString("utf8").trim());

await client.close();
