import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { slides } from "../slides/deck";
import { useTheme } from "../theme";
import { SlideView } from "./SlideView";

function readHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const number = Number.parseInt(raw, 10);
  if (!Number.isFinite(number) || number < 1) {
    return 0;
  }
  return Math.min(number - 1, slides.length - 1);
}

export function Deck() {
  const [index, setIndex] = useState(readHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();

  const go = useCallback((next: number, historyMode: "push" | "replace" = "push") => {
    const clamped = Math.min(Math.max(next, 0), slides.length - 1);
    setIndex(clamped);
    const hash = `#${clamped + 1}`;
    if (window.location.hash === hash) {
      return;
    }
    if (historyMode === "replace") {
      history.replaceState(null, "", hash);
    } else {
      history.pushState(null, "", hash);
    }
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      history.replaceState(null, "", "#1");
    }
    const sync = () => setIndex(readHash());
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "BUTTON" ||
          target.tagName === "A")
      ) {
        return;
      }
      if (menuOpen && event.key !== "Escape" && event.key !== "s" && event.key !== "S") {
        return;
      }
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        go(event.shiftKey ? index - 1 : index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp" || event.key === "Backspace") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        go(0);
      } else if (event.key === "End") {
        event.preventDefault();
        go(slides.length - 1);
      } else if (event.key === "Escape") {
        setMenuOpen(false);
      } else if (event.key === "s" || event.key === "S") {
        setMenuOpen((open) => !open);
      } else if (event.key === "t" || event.key === "T") {
        toggle();
      } else if (event.key === "f" || event.key === "F") {
        void toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, menuOpen, toggle]);

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let blocked = false;
    const start = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      blocked = Boolean((event.target as HTMLElement | null)?.closest(".code-scroll, a, button"));
    };
    const end = (event: TouchEvent) => {
      if (blocked) {
        return;
      }
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) {
        return;
      }
      go(dx < 0 ? index + 1 : index - 1);
    };
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchend", end, { passive: true });
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, [go, index]);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setFullscreen(false);
    }
  }

  const slide = slides[index];
  const sections: { name: string; indexes: number[] }[] = [];
  slides.forEach((item, itemIndex) => {
    const last = sections[sections.length - 1];
    if (!last || last.name !== item.section) {
      sections.push({ name: item.section, indexes: [itemIndex] });
    } else {
      last.indexes.push(itemIndex);
    }
  });

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-ink">
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line bg-surface px-3 py-2 md:px-5">
        <p className="flex items-center gap-2 font-display text-[18px]">
          <span className="inline-block h-4 w-4 bg-accent" aria-hidden />
          Codelab MCP · Lomé
        </p>
        <p className="hidden text-[18px] text-muted md:block">{slide.section}</p>
        <p className="ml-auto font-mono text-[18px]">
          {index + 1} / {slides.length}
        </p>
        <button
          type="button"
          className="bg-surface-2 px-3 py-2 font-display text-[18px]"
          onClick={() => go(index - 1)}
          aria-label="Slide précédente"
        >
          ←
        </button>
        <button
          type="button"
          className="bg-surface-2 px-3 py-2 font-display text-[18px]"
          onClick={() => go(index + 1)}
          aria-label="Slide suivante"
        >
          →
        </button>
        <button
          type="button"
          className="bg-surface-2 px-3 py-2 font-display text-[18px]"
          onClick={() => setMenuOpen(true)}
        >
          Sommaire
        </button>
        <button
          type="button"
          className="bg-surface-2 px-3 py-2 font-display text-[18px]"
          onClick={toggle}
        >
          {theme === "dark" ? "Clair" : "Sombre"}
        </button>
        <button
          type="button"
          className="bg-accent px-3 py-2 font-display text-[18px] text-accent-ink"
          onClick={() => {
            void toggleFullscreen();
          }}
        >
          {fullscreen ? "Fenêtre" : "Plein écran"}
        </button>
      </header>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={index}
            className="absolute inset-0 overflow-x-hidden overflow-y-auto"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, x: -16 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
            aria-labelledby="slide-title"
          >
            <SlideView slide={slide} index={index} total={slides.length} />
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="h-2 shrink-0 bg-surface-2" aria-hidden>
        <div
          className="h-full bg-accent"
          style={{ width: `${((index + 1) / slides.length) * 100}%` }}
        />
      </div>
      <p className="sr-only">
        Progression : slide {index + 1} sur {slides.length}
      </p>

      {menuOpen ? (
        <div className="fixed inset-0 z-20 flex bg-bg">
          <div className="flex w-full flex-col md:mx-auto md:max-w-3xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="font-display text-2xl">Sommaire</h2>
              <button
                type="button"
                className="bg-accent px-3 py-2 font-display text-[18px] text-accent-ink"
                onClick={() => setMenuOpen(false)}
              >
                Fermer
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4">
              {sections.map((section) => (
                <section key={section.name} className="mb-5">
                  <h3 className="font-display text-[18px] text-accent">{section.name}</h3>
                  <ul className="mt-2">
                    {section.indexes.map((itemIndex) => (
                      <li key={itemIndex}>
                        <button
                          type="button"
                          className={`w-full px-2 py-2 text-left text-[1.15rem] ${
                            itemIndex === index ? "bg-surface-2" : ""
                          }`}
                          onClick={() => {
                            go(itemIndex);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="mr-3 font-mono text-accent">
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          {slides[itemIndex].title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
