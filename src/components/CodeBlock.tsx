import { useEffect, useState } from "react";
import { highlightCode, type CodeLanguage } from "../highlight";
import { useTheme } from "../theme";

type Props = {
  code: string;
  filename: string;
  language?: CodeLanguage;
};

export function CodeBlock({ code, filename, language = "typescript" }: Props) {
  const { theme } = useTheme();
  const [html, setHtml] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const source = code.replace(/\n$/, "");

  useEffect(() => {
    let alive = true;
    setHtml(null);
    highlightCode(source, language, theme)
      .then((result) => {
        if (alive) {
          setHtml(result);
        }
      })
      .catch(() => {
        if (alive) {
          setHtml(null);
        }
      });
    return () => {
      alive = false;
    };
  }, [source, language, theme]);

  function copyWithSelection(text: string) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }

  function copy() {
    const mark = (next: "copied" | "failed") => {
      setStatus(next);
      window.setTimeout(() => setStatus("idle"), 2500);
    };
    if (copyWithSelection(source)) {
      mark("copied");
      return;
    }
    if (!navigator.clipboard) {
      mark("failed");
      return;
    }
    void navigator.clipboard.writeText(source).then(
      () => mark("copied"),
      () => mark("failed"),
    );
  }

  return (
    <figure className="flex min-h-0 min-w-0 flex-col border border-line border-l-[6px] border-l-accent bg-code">
      <figcaption className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2">
        <span className="shrink-0 bg-accent-2 px-2 py-1 font-display text-[15px] font-bold text-accent-ink uppercase">
          À copier
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[18px] text-ink">
          {filename}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="shrink-0 bg-accent px-3 py-2 font-display text-[18px] text-accent-ink"
        >
          {status === "copied" ? "Copié" : status === "failed" ? "Échec" : "Copier"}
        </button>
      </figcaption>
      <div className="code-scroll max-h-[58vh] overflow-auto p-4">
        {html ? (
          <div className="code-html" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="m-0 font-mono text-[18px] leading-relaxed whitespace-pre lg:text-[20px]">
            <code>{source}</code>
          </pre>
        )}
      </div>
    </figure>
  );
}

type OutputProps = {
  code: string;
  label: string;
  kind?: "result" | "example";
};

export function OutputBlock({ code, label, kind = "result" }: OutputProps) {
  const badge = kind === "result" ? "Résultat attendu" : "Exemple à lire";
  return (
    <figure
      className="flex min-h-0 min-w-0 flex-col border-2 border-dashed border-line bg-surface select-none"
      aria-label={`${badge} : ${label}. Ne pas copier.`}
    >
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b-2 border-dashed border-line px-3 py-2">
        <span className="shrink-0 border-2 border-muted px-2 py-0.5 font-display text-[15px] font-bold text-muted uppercase">
          {badge}
        </span>
        <span className="order-last basis-full font-mono text-[17px] break-words text-muted sm:order-none sm:basis-0 sm:flex-1">
          {label}
        </span>
        <span className="shrink-0 font-display text-[15px] text-muted">ne pas copier</span>
      </figcaption>
      <div className="code-scroll max-h-[58vh] overflow-auto p-4">
        <pre className="m-0 font-mono text-[18px] leading-relaxed whitespace-pre text-muted lg:text-[19px]">
          <code>{code.replace(/\n$/, "")}</code>
        </pre>
      </div>
    </figure>
  );
}
