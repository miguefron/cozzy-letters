"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "span",
];

const ALLOWED_ATTR = ["href", "target", "rel", "style"];

function isHTML(str: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(str);
}

function plainTextToHTML(text: string): string {
  return text
    .split("\n\n")
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export default function LetterContent({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  const sanitized = useMemo(() => {
    const source = isHTML(html) ? html : plainTextToHTML(html);
    return DOMPurify.sanitize(source, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    });
  }, [html]);

  return (
    <div
      className={`cozy-prose ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
