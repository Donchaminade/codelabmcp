import type { ReactNode } from "react";

export function Bullets({ items }: { items: ReactNode[] }) {
  const twoColumns = items.length > 3;
  return (
    <ol className={`grid gap-3 md:gap-4 ${twoColumns ? "lg:grid-cols-2" : ""}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-4 border border-line bg-surface p-4 md:p-5"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent font-display text-[1.1rem] font-bold text-accent-ink md:h-12 md:w-12 md:text-[1.25rem]"
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="pt-1 text-[1.2rem] leading-snug md:text-[clamp(1.25rem,1.55vw,1.75rem)]">
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Compare({
  left,
  right,
}: {
  left: { title: string; points: string[] };
  right: { title: string; points: string[] };
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
      {[left, right].map((column, columnIndex) => (
        <section
          key={column.title}
          className="relative overflow-hidden border border-line bg-surface p-5 md:p-7"
        >
          <div
            className={`absolute top-0 left-0 h-2 w-full ${columnIndex === 0 ? "bg-accent-3" : "bg-accent-2"}`}
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full ${
              columnIndex === 0 ? "bg-surface-2" : "border-[10px] border-surface-2"
            }`}
            aria-hidden
          />
          <h3 className="relative font-display text-2xl font-bold md:text-[clamp(1.8rem,2.4vw,2.6rem)]">
            {column.title}
          </h3>
          <ul className="relative mt-4 flex flex-col gap-3">
            {column.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-[1.2rem] leading-snug md:text-[clamp(1.2rem,1.45vw,1.6rem)]"
              >
                <span
                  className={`mt-[0.5em] h-3 w-3 shrink-0 ${columnIndex === 0 ? "bg-accent-3" : "bg-accent-2"}`}
                  aria-hidden
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-[6px] border-l-accent-2 bg-surface px-4 py-3 text-[1.1rem] leading-snug md:text-[clamp(1.1rem,1.3vw,1.4rem)]">
      {children}
    </p>
  );
}

export function Stack({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 flex-col gap-4 md:gap-5">{children}</div>;
}
