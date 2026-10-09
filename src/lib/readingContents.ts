import type { ContentBlock } from "../content/types";

export interface ReadingSection {
  id: string;
  label: string;
}
export function readingSections(body: ContentBlock[]): ReadingSection[] {
  return body.flatMap((block) => {
    if (block._type !== "block" || block.style !== "h2") return [];
    const label = block.children
      .map((span) => span.text)
      .join("")
      .trim();
    return label ? [{ id: block._key, label }] : [];
  });
}

export function currentSection(
  headings: { id: string; top: number }[],
  offset = 140,
) {
  let active = headings[0]?.id;
  for (const heading of headings) {
    if (heading.top > offset) break;
    active = heading.id;
  }
  return active;
}
