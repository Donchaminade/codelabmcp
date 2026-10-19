const steps = [
  {
    title: "Cursor",
    subtitle: "Hôte",
    lines: ["L'agent parle ici", "Réglages MCP"],
  },
  {
    title: "Client MCP",
    subtitle: "Dans Cursor",
    lines: ["Une connexion", "Liste et appelle les outils"],
  },
  {
    title: "Serveur MCP",
    subtitle: "stdio, local",
    lines: ["meteo_lome", "risque_pluie"],
  },
  {
    title: "Open-Meteo",
    subtitle: "HTTPS, sans clé",
    lines: ["api.open-meteo.com", "6.1319, 1.2228"],
  },
];

function Arrow() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-8 w-8 shrink-0 rotate-90 text-accent lg:rotate-0"
      aria-hidden
    >
      <path
        d="M6 24h30M28 12l12 12-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}

export function Diagram() {
  return (
    <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
      {steps.map((step, index) => (
        <div key={step.title} className="contents">
          <article className="flex-1 border border-line bg-surface p-4">
            <p className="font-mono text-[18px] text-accent">{step.subtitle}</p>
            <h3 className="mt-1 font-display text-2xl">{step.title}</h3>
            <ul className="mt-2">
              {step.lines.map((line) => (
                <li key={line} className="text-[1.15rem] leading-snug">
                  {line}
                </li>
              ))}
            </ul>
          </article>
          {index < steps.length - 1 ? <Arrow /> : null}
        </div>
      ))}
    </div>
  );
}
