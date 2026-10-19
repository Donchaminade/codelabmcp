import type { Slide } from "../slides/deck";
import { Decor } from "./Decor";

type Props = {
  slide: Slide;
  index: number;
  total: number;
};

function Footer({ slide, index, total, inverted = false }: Props & { inverted?: boolean }) {
  return (
    <footer
      className={`relative z-10 mt-auto flex items-center gap-4 pt-6 text-[1rem] md:text-[1.05rem] ${
        inverted ? "text-accent-ink" : "text-muted"
      }`}
    >
      <span className="hidden font-display sm:inline">Chaminade Adjolou · Codelab MCP Lomé</span>
      <span className={`hidden h-[2px] flex-1 sm:block ${inverted ? "bg-accent-ink" : "bg-line"}`} />
      <span className="font-mono">
        {slide.section} · {String(index + 1).padStart(2, "0")} / {total}
      </span>
    </footer>
  );
}

function Cover({ slide, index, total }: Props) {
  return (
    <div className="relative flex min-h-full flex-col px-6 py-8 md:px-[7vmin] md:py-[6vmin]">
      <Decor layout={slide.layout} index={index} />
      <div className="relative z-10 flex flex-1 flex-col justify-center md:max-w-[58%]">
        <p className="inline-flex w-fit bg-accent px-3 py-1 font-display text-[1rem] tracking-wide text-accent-ink uppercase md:text-[1.1rem]">
          Codelab · Lomé, Togo
        </p>
        <h1
          id="slide-title"
          className="mt-5 font-display text-[2.6rem] leading-[1.02] font-bold md:text-[clamp(3rem,6.2vw,6.4rem)]"
        >
          {slide.title}
        </h1>
        {slide.subtitle ? (
          <p className="mt-3 font-display text-[1.6rem] text-accent md:text-[clamp(1.8rem,3vw,3.2rem)]">
            {slide.subtitle}
          </p>
        ) : null}
        <div className="mt-6 h-2 w-28 bg-accent-3" />
        <div className="mt-6">{slide.content}</div>
      </div>
      <Footer slide={slide} index={index} total={total} />
    </div>
  );
}

function Closing({ slide, index, total }: Props) {
  return (
    <div className="relative flex min-h-full flex-col px-6 py-8 md:px-[7vmin] md:py-[6vmin]">
      <Decor layout={slide.layout} index={index} />
      <div className="relative z-10 flex flex-1 flex-col justify-center md:max-w-[56%]">
        <p className="font-display text-[1.1rem] tracking-wide text-accent uppercase">{slide.section}</p>
        <h2
          id="slide-title"
          className="mt-3 font-display text-[2.6rem] leading-[1.04] font-bold md:text-[clamp(3rem,5.6vw,5.8rem)]"
        >
          {slide.title}
        </h2>
        <div className="mt-6 h-2 w-28 bg-accent-2" />
        <div className="mt-6">{slide.content}</div>
      </div>
      <Footer slide={slide} index={index} total={total} />
    </div>
  );
}

function Section({ slide, index, total }: Props) {
  return (
    <div className="relative flex min-h-full flex-col md:flex-row">
      <div className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-accent px-6 py-8 text-accent-ink md:w-[38%] md:px-[6vmin] md:py-[6vmin]">
        <div className="pointer-events-none absolute -bottom-[10vmin] -left-[10vmin] hidden h-[34vmin] w-[34vmin] rounded-full border-[1.4vmin] border-accent-ink/25 md:block" aria-hidden />
        <p className="relative font-display text-[1.1rem] tracking-wide uppercase">{slide.section}</p>
        <p className="relative font-display text-[6rem] leading-none font-bold md:text-[clamp(8rem,18vw,18rem)]">
          {slide.number}
        </p>
      </div>
      <div className="relative flex flex-1 flex-col px-6 py-8 md:px-[7vmin] md:py-[6vmin]">
        <Decor layout={slide.layout} index={index} />
        <div className="relative z-10 flex flex-1 flex-col justify-center md:max-w-[80%]">
          <h2
            id="slide-title"
            className="font-display text-[2.4rem] leading-[1.05] font-bold md:text-[clamp(2.8rem,5vw,5.4rem)]"
          >
            {slide.title}
          </h2>
          <div className="mt-6 h-2 w-24 bg-accent-3" />
          {slide.subtitle ? (
            <p className="mt-6 max-w-3xl text-[1.3rem] leading-snug text-muted md:text-[clamp(1.4rem,1.9vw,2.1rem)]">
              {slide.subtitle}
            </p>
          ) : null}
        </div>
        <Footer slide={slide} index={index} total={total} />
      </div>
    </div>
  );
}

function Content({ slide, index, total }: Props) {
  return (
    <div className="relative flex min-h-full flex-col px-5 py-6 md:px-[6vmin] md:py-[4.5vmin]">
      <Decor layout={slide.layout} index={index} />
      <div className="relative z-10 md:pr-[10vmin]">
        <p className="flex items-center gap-3 font-display text-[1rem] tracking-wide text-accent uppercase md:text-[1.1rem]">
          <span className="inline-block h-3 w-3 bg-accent-2" aria-hidden />
          {slide.section}
        </p>
        <h2
          id="slide-title"
          className="mt-2 font-display text-[2rem] leading-tight font-bold md:text-[clamp(2.4rem,3.6vw,3.8rem)]"
        >
          {slide.title}
        </h2>
        <div className="mt-4 h-[6px] w-20 bg-accent" />
      </div>
      <div className="relative z-10 mt-6 flex flex-1 flex-col justify-center md:mt-8">
        {slide.content}
      </div>
      <Footer slide={slide} index={index} total={total} />
    </div>
  );
}

export function SlideView(props: Props) {
  if (props.slide.layout === "cover") {
    return <Cover {...props} />;
  }
  if (props.slide.layout === "closing") {
    return <Closing {...props} />;
  }
  if (props.slide.layout === "section") {
    return <Section {...props} />;
  }
  return <Content {...props} />;
}
