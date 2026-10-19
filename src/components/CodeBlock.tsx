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
  const [copied, setCopied] = useState(false);
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

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="flex min-h-0 flex-col border border-line bg-code">
      <figcaption className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2">
        <span className="min-w-0 flex-1 truncate font-mono text-[18px] text-ink">
          {filename}
        </span>
        <button
          type="button"
          onClick={() => {
            void copy();
          }}
          className="shrink-0 bg-accent px-3 py-2 font-display text-[18px] text-accent-ink"
        >
          {copied ? "Copié" : "Copier"}
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
