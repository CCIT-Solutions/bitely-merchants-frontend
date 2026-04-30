"use client";

import { ReactNode } from "react";
import { useLang } from "@/hooks/useLang";

type TranslateProps = {
  text: string;
  values?: Record<string, string | number>;
  components?: Record<string, ReactNode>;
};

export default function Translate({ text, components }: TranslateProps) {
  const { t } = useLang();
  const translated = t(text);

  if (typeof translated !== "string") return null;

  if (!components) return <>{translated}</>;

  const elementPattern = /<(\w+)>(.*?)<\/\1>/g;
  const parts: (string | ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = elementPattern.exec(translated)) !== null) {
    const [full, tag] = match;
    const start = match.index;

    // Add text before the tag
    if (start > lastIndex) {
      parts.push(translated.slice(lastIndex, start));
    }

    // Add the corresponding component (if exists)
    const component = components[tag];
    parts.push(
      component ? <span key={parts.length}>{component}</span> : full
    );

    lastIndex = start + full.length;
  }

  // Add remaining text
  if (lastIndex < translated.length) {
    parts.push(translated.slice(lastIndex));
  }

  return <>{parts.map((p, i) => <span key={i}>{p}</span>)}</>;
}
