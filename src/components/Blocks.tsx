import type { ReactNode } from "react";

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex max-w-5xl flex-col gap-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 text-[1.25rem] leading-snug md:text-[1.65rem]"
        >
          <span className="mt-[0.55rem] h-3 w-3 shrink-0 bg-accent" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
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
    <div className="grid gap-4 lg:grid-cols-2">
      {[left, right].map((column) => (
        <section key={column.title} className="border border-line bg-surface p-5">
          <h3 className="font-display text-2xl text-accent md:text-3xl">
            {column.title}
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {column.points.map((point) => (
              <li key={point} className="text-[1.2rem] leading-snug md:text-[1.4rem]">
                {point}
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
    <p className="max-w-5xl border-l-4 border-l-accent bg-surface px-4 py-3 text-[1.15rem] leading-snug md:text-[1.3rem]">
      {children}
    </p>
  );
}

export function Stack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}
