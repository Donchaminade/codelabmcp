export type ToolCard = {
  name: string;
  meta: string;
  role: string;
  detail?: string;
  links: { label: string; href: string }[];
};

export function ToolCards({ cards }: { cards: ToolCard[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <li
          key={card.name}
          className="flex flex-col border border-line border-l-4 border-l-accent bg-surface p-4"
        >
          <h3 className="font-display text-[1.45rem] leading-tight">{card.name}</h3>
          <p className="mt-1 font-mono text-[18px] text-accent">{card.meta}</p>
          <p className="mt-2 text-[1.15rem] leading-snug md:text-[1.25rem]">{card.role}</p>
          {card.detail ? (
            <p className="mt-2 font-mono text-[18px] leading-snug text-muted break-all">
              {card.detail}
            </p>
          ) : null}
          <p className="mt-3 flex flex-col gap-1">
            {card.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[18px] leading-snug text-accent underline decoration-2 underline-offset-4 break-all"
              >
                {link.label}
              </a>
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
}
