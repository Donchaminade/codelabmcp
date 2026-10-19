import type { SlideLayout } from "../slides/deck";

function Dots({ className, cols = 6, rows = 5 }: { className: string; cols?: number; rows?: number }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${cols * 24} ${rows * 24}`}
      aria-hidden
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <circle
          key={i}
          cx={(i % cols) * 24 + 12}
          cy={Math.floor(i / cols) * 24 + 12}
          r="3.5"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function Stripes({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={i * 26} y="0" width="10" height="120" fill="currentColor" />
      ))}
    </svg>
  );
}

function CoverDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute top-0 left-0 h-full w-3 bg-accent md:w-4" />
      <div className="absolute -top-[18vmin] -right-[14vmin] hidden h-[78vmin] w-[78vmin] rounded-full bg-accent md:block" />
      <div className="absolute top-[34%] right-[24vmin] hidden h-[30vmin] w-[30vmin] rounded-full border-[1.4vmin] border-accent-2 lg:block" />
      <div className="absolute right-[6vmin] bottom-[14vmin] hidden h-[24vmin] w-[34vmin] bg-accent-2 md:block" />
      <svg
        className="absolute right-[38vmin] bottom-[12vmin] hidden h-[16vmin] w-[16vmin] text-accent-3 lg:block"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <polygon points="0,100 50,0 100,100" fill="currentColor" />
      </svg>
      <Dots className="absolute top-[8vmin] right-[44vmin] hidden h-[14vmin] w-[17vmin] text-line lg:block" />
      <div className="absolute right-0 bottom-0 h-3 w-1/3 bg-accent-3 md:hidden" />
      <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-accent md:hidden" />
    </div>
  );
}

function ClosingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -bottom-[24vmin] -right-[10vmin] hidden h-[80vmin] w-[80vmin] rounded-full bg-accent-2 md:block" />
      <div className="absolute top-[10vmin] right-[10vmin] hidden h-[22vmin] w-[22vmin] bg-accent md:block" />
      <div className="absolute top-[22vmin] right-[26vmin] hidden h-[18vmin] w-[18vmin] rounded-full border-[1.2vmin] border-accent-3 lg:block" />
      <Stripes className="absolute bottom-[8vmin] left-[52%] hidden h-[14vmin] w-[14vmin] text-line lg:block" />
      <div className="absolute top-0 left-0 h-3 w-full bg-accent" />
      <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-accent-2 md:hidden" />
    </div>
  );
}

function ContentDecor({ index }: { index: number }) {
  const variant = index % 3;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute top-0 left-0 h-full w-2 bg-accent" />
      {variant === 0 ? (
        <>
          <div className="absolute -top-[10vmin] -right-[10vmin] hidden h-[30vmin] w-[30vmin] rounded-full bg-surface-2 md:block" />
          <div className="absolute top-[6vmin] right-[6vmin] hidden h-[5vmin] w-[5vmin] bg-accent md:block" />
          <Dots className="absolute bottom-[5vmin] right-[3vmin] hidden h-[9vmin] w-[11vmin] text-line lg:block" />
        </>
      ) : null}
      {variant === 1 ? (
        <>
          <svg
            className="absolute top-0 right-0 hidden h-[26vmin] w-[26vmin] text-surface-2 md:block"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <polygon points="0,0 100,0 100,100" fill="currentColor" />
          </svg>
          <div className="absolute top-[5vmin] right-[5vmin] hidden h-[6vmin] w-[6vmin] rounded-full bg-accent-2 md:block" />
          <div className="absolute top-[34vmin] right-[2.5vmin] hidden h-[14vmin] w-[1.2vmin] bg-accent-3 lg:block" />
        </>
      ) : null}
      {variant === 2 ? (
        <>
          <div className="absolute top-[24vmin] -right-[20vmin] hidden h-[32vmin] w-[32vmin] rounded-full border-[1.6vmin] border-surface-2 md:block" />
          <Stripes className="absolute top-[5vmin] right-[4vmin] hidden h-[8vmin] w-[8vmin] text-accent md:block" />
          <div className="absolute right-[3vmin] bottom-[16vmin] hidden h-[4vmin] w-[4vmin] bg-accent-3 lg:block" />
        </>
      ) : null}
    </div>
  );
}

function SectionDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-[16vmin] -bottom-[16vmin] hidden h-[56vmin] w-[56vmin] rounded-full bg-surface-2 md:block" />
      <div className="absolute right-[12vmin] bottom-[14vmin] hidden h-[18vmin] w-[18vmin] rounded-full border-[1.2vmin] border-accent-2 lg:block" />
      <Dots className="absolute top-[7vmin] right-[7vmin] hidden h-[12vmin] w-[14vmin] text-line md:block" />
    </div>
  );
}

export function Decor({ layout, index }: { layout: SlideLayout; index: number }) {
  if (layout === "cover") {
    return <CoverDecor />;
  }
  if (layout === "closing") {
    return <ClosingDecor />;
  }
  if (layout === "section") {
    return <SectionDecor />;
  }
  return <ContentDecor index={index} />;
}
