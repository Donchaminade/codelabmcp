import bash from "@shikijs/langs/bash";
import json from "@shikijs/langs/json";
import typescript from "@shikijs/langs/typescript";
import githubDark from "@shikijs/themes/github-dark";
import githubLight from "@shikijs/themes/github-light";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { ThemeName } from "./theme";

const languages = ["typescript", "json", "bash"] as const;
export type CodeLanguage = (typeof languages)[number] | "text";

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubDark, githubLight],
      langs: [typescript, json, bash],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  language: CodeLanguage,
  theme: ThemeName,
) {
  if (language === "text") {
    return null;
  }
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.replace(/\n$/, ""), {
    lang: language,
    theme: theme === "light" ? "github-light" : "github-dark",
  });
}
